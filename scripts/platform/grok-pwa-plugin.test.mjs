import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  appNameFromHost,
  createHeadInjector,
  grokXCreatorHeadTags,
  injectGrokPwaHead,
  isDocumentPath,
  isInstallQuery,
  isInstallTutorialRequest,
  publicAppHost,
  renderWebManifest,
  resolveOgCardAsset,
  snapshotOgIdentity,
  stripInstallParams,
} from "../grok-pwa-shared.mjs";
import { renderInstallPage } from "../grok-pwa-plugin.mjs";

const TEMPLATE_ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");

function withPublicHostname(host, run) {
  const previous = process.env.VITE_PUBLIC_HOSTNAME;
  process.env.VITE_PUBLIC_HOSTNAME = host;
  try {
    return run();
  } finally {
    if (previous === undefined) delete process.env.VITE_PUBLIC_HOSTNAME;
    else process.env.VITE_PUBLIC_HOSTNAME = previous;
  }
}

test("injects before </head>", () => {
  const out = injectGrokPwaHead("<html><head><title>x</title></head><body></body></html>");
  assert.match(out, /rel="manifest"/);
  assert.match(out, /apple-touch-icon/);
  assert.match(out, /grok-app-builder\/extensions\.js/);
  assert.ok(out.indexOf("manifest") < out.indexOf("</head>"));
});

test("injects the extensions script without a project id", () => {
  const out = injectGrokPwaHead("<html><head></head></html>", {
    appName: "Demo",
    projectId: "",
  });
  assert.match(out, /src="https:\/\/grok\.com\/grok-app-builder\/extensions\.js" defer/);
  assert.doesNotMatch(out, /grok-project-id/);
  assert.doesNotMatch(out, /data-project-id/);
  assert.doesNotMatch(out, /property="grok:app_id"/);
});

test("injects project id on the script and meta when provided", () => {
  const out = injectGrokPwaHead("<html><head></head></html>", {
    appName: "Demo",
    projectId: "proj-123",
  });
  assert.match(out, /name="grok-project-id" content="proj-123"/);
  assert.match(out, /data-project-id="proj-123"/);
  assert.match(out, /property="grok:app_id" content="proj-123"/);
});

test("does not duplicate grok:app_id", () => {
  const ctx = { appName: "Demo", projectId: "proj-123" };
  const once = injectGrokPwaHead("<html><head></head></html>", ctx);
  const twice = injectGrokPwaHead(once, ctx);
  assert.equal(once, twice);
  assert.equal(twice.split('property="grok:app_id"').length - 1, 1);
});

test("omits x:creator tags without both creator values", () => {
  assert.deepEqual(grokXCreatorHeadTags("", "42"), []);
  assert.deepEqual(grokXCreatorHeadTags("@alice", ""), []);
  const out = injectGrokPwaHead("<html><head></head></html>", {
    appName: "Demo",
    projectId: "",
    creator: "@alice",
    creatorId: "",
  });
  assert.doesNotMatch(out, /property="x:creator"/);
});

test("injects x:creator tags when both creator values are set", () => {
  const out = injectGrokPwaHead("<html><head></head></html>", {
    appName: "Demo",
    projectId: "",
    creator: "@alice",
    creatorId: "42",
  });
  assert.match(out, /property="x:creator" content="@alice"/);
  assert.match(out, /property="x:creator:id" content="42"/);
});

test("escapes x:creator values", () => {
  const tags = grokXCreatorHeadTags('"><script>', '1" onclick="alert(1)');
  assert.equal(
    tags[0],
    '<meta property="x:creator" content="&quot;&gt;&lt;script&gt;">',
  );
  assert.equal(
    tags[1],
    '<meta property="x:creator:id" content="1&quot; onclick=&quot;alert(1)">',
  );
});

test("does not duplicate x:creator tags", () => {
  const ctx = { appName: "Demo", projectId: "", creator: "@alice", creatorId: "42" };
  const once = injectGrokPwaHead("<html><head></head></html>", ctx);
  const twice = injectGrokPwaHead(once, ctx);
  assert.equal(once, twice);
  assert.equal(twice.split('property="x:creator" content=').length - 1, 1);
  assert.equal(twice.split('property="x:creator:id"').length - 1, 1);
});

test("preserves route share tags and fills only missing fallbacks", () => {
  const html = [
    "<html><head><title>Document Route Title</title>",
    '<meta property="og:title" content="Route OG Title">',
    '<meta property="og:description" content="Route description">',
    '<meta property="og:image" content="https://cdn.example/route.jpg">',
    '<meta name="twitter:card" content="summary">',
    '<meta name="twitter:title" content="Route Twitter Title">',
    "</head></html>",
  ].join("");
  const out = injectGrokPwaHead(html, {
    appName: "Fallback App",
    site: { title: "Site Name", description: "Site description", type: "x:game" },
  });
  assert.match(out, /property="og:title" content="Route OG Title"/);
  assert.match(out, /property="og:description" content="Route description"/);
  assert.match(out, /property="og:image" content="https:\/\/cdn\.example\/route\.jpg"/);
  assert.match(out, /name="twitter:card" content="summary"/);
  assert.match(out, /name="twitter:title" content="Route Twitter Title"/);
  assert.match(out, /property="og:site_name" content="Site Name"/);
  assert.match(out, /name="twitter:description" content="Site description"/);
  assert.match(out, /property="og:type" content="x:game"/);
  assert.equal(out.split('property="og:title"').length - 1, 1);
  assert.equal(out.split('property="og:image"').length - 1, 1);
});

test("document title wins for generated route title while site.title remains site_name", () => {
  const out = injectGrokPwaHead("<html><head><title>Route Document</title></head></html>", {
    appName: "Fallback App",
    site: { title: "Site Name" },
  });
  assert.match(out, /property="og:title" content="Route Document"/);
  assert.match(out, /name="twitter:title" content="Route Document"/);
  assert.match(out, /property="og:site_name" content="Site Name"/);
});

test("does not duplicate twitter:card or og:title", () => {
  const once = injectGrokPwaHead("<html><head><title>Hello World</title></head></html>");
  const twice = injectGrokPwaHead(once);
  assert.equal(once, twice);
  assert.equal(twice.split('name="twitter:card"').length - 1, 1);
  assert.equal(twice.split('property="og:title"').length - 1, 1);
});

test("a baked site.image is treated as a custom card", () => {
  const out = withPublicHostname("wild-race.grok.me", () =>
    injectGrokPwaHead("<html><head></head></html>", {
      host: "attacker.example",
      cwd: mkdtempSync(join(tmpdir(), "grok-og-image-only-")),
      site: { title: "Wild Race", image: "/og.jpg" },
    }),
  );
  assert.match(out, /property="og:image" content="https:\/\/wild-race\.grok\.me\/og\.jpg"/);
  assert.doesNotMatch(out, /og\.grok\.me/);
});

test("baked identity does not need a workspace filesystem", () => {
  const empty = mkdtempSync(join(tmpdir(), "grok-og-empty-"));
  const out = withPublicHostname("wild-race.grok.me", () =>
    injectGrokPwaHead("<html><head></head></html>", {
      host: "attacker.example",
      cwd: empty,
      site: { title: "Pixel Nova", type: "x:game", card: "custom" },
    }),
  );
  assert.match(out, /property="og:title" content="Pixel Nova"/);
  assert.match(out, /property="og:type" content="x:game"/);
  assert.match(out, /property="og:image" content="https:\/\/wild-race\.grok\.me\/og\.jpg"/);
  assert.doesNotMatch(out, /og\.grok\.me/);
});

test("a public card file wins over a baked site without card=custom", () => {
  // Deploy middleware always passes a baked `site`. If that snapshot missed
  // the file, public/og.jpg must still beat the og.grok.me placeholder.
  const root = mkdtempSync(join(tmpdir(), "grok-og-card-"));
  mkdirSync(join(root, "public"));
  writeFileSync(join(root, "public/og.jpg"), "x");
  const out = withPublicHostname("wild-race.grok.me", () =>
    injectGrokPwaHead("<html><head></head></html>", {
      host: "attacker.example",
      cwd: root,
      site: {},
    }),
  );
  assert.match(out, /property="og:image" content="https:\/\/wild-race\.grok\.me\/og\.jpg"/);
  assert.doesNotMatch(out, /og\.grok\.me/);
});

test("public/og.png wins when jpg is absent", () => {
  const root = mkdtempSync(join(tmpdir(), "grok-og-png-"));
  mkdirSync(join(root, "public"));
  writeFileSync(join(root, "public/og.png"), "x");
  const out = withPublicHostname("wild-race.grok.me", () =>
    injectGrokPwaHead("<html><head></head></html>", {
      host: "attacker.example",
      cwd: root,
      site: { title: "Wild Race" },
    }),
  );
  assert.match(out, /property="og:image" content="https:\/\/wild-race\.grok\.me\/og\.png"/);
  assert.doesNotMatch(out, /og\.grok\.me/);
});

test("resolveOgCardAsset: disk file, then bake, then empty (placeholder)", () => {
  const empty = mkdtempSync(join(tmpdir(), "grok-og-none-"));
  assert.equal(resolveOgCardAsset({}, empty), "");
  assert.equal(resolveOgCardAsset({ title: "X" }, empty), "");

  const baked = resolveOgCardAsset({ card: "custom", image: "/og.jpg" }, empty);
  assert.equal(baked, "/og.jpg");

  const root = mkdtempSync(join(tmpdir(), "grok-og-disk-"));
  mkdirSync(join(root, "public"));
  writeFileSync(join(root, "public/og.jpg"), "x");
  assert.equal(resolveOgCardAsset({}, root), "/og.jpg");
  assert.equal(resolveOgCardAsset({ card: "custom", image: "/other.png" }, root), "/og.jpg");
});

test("snapshotOgIdentity stamps card=custom from a public card file", () => {
  const root = mkdtempSync(join(tmpdir(), "grok-og-snap-"));
  mkdirSync(join(root, "public"));
  writeFileSync(join(root, "public/og.jpg"), "x");
  const { site } = snapshotOgIdentity(root);
  assert.equal(site.card, "custom");
  assert.equal(site.image, "/og.jpg");
  assert.equal(site.banner, undefined);
});

test("snapshotOgIdentity stamps banner from public/x-banner.jpg", () => {
  const root = mkdtempSync(join(tmpdir(), "grok-og-banner-"));
  mkdirSync(join(root, "public"));
  writeFileSync(join(root, "public/x-banner.jpg"), "x");
  const { site } = snapshotOgIdentity(root);
  assert.equal(site.banner, "/x-banner.jpg");
});

test("emits x:game:image for an explicitly configured public host", () => {
  const html = "<html><head><meta property=\"x:game:image\" content=\"old\"></head></html>";
  const out = withPublicHostname("wild-race.grok.me", () =>
    injectGrokPwaHead(html, {
      host: "attacker.example",
      site: { title: "Wild Race", type: "x:game", card: "custom", banner: "/x-banner.jpg" },
    }),
  );
  assert.match(out, /property="x:game:image" content="old"/);
  assert.match(out, /property="x:game:image:width" content="1200"/);
  assert.match(out, /property="x:game:image:height" content="264"/);
  assert.equal(out.split('property="x:game:image"').length - 1, 1);
});

test("does not emit x:game:image without a public host or banner", () => {
  const noHost = injectGrokPwaHead("<html><head></head></html>", {
    site: { banner: "/x-banner.jpg" },
  });
  assert.doesNotMatch(noHost, /x:game:image/);
  const noBanner = injectGrokPwaHead("<html><head></head></html>", {
    host: "wild-race.grok.me",
    site: { type: "x:game", card: "custom" },
  });
  assert.doesNotMatch(noBanner, /x:game:image/);
});

test("site title Grok App is a real name, not a sentinel", () => {
  const out = injectGrokPwaHead("<html><head></head></html>", {
    host: "wild-race.grok.me",
    site: { title: "Grok App" },
  });
  assert.match(out, /property="og:title" content="Grok App"/);
});

test("site.title is the host-independent title fallback", () => {
  const out = injectGrokPwaHead("<html><head></head></html>", {
    host: "wild-race.grok.me",
  });
  assert.match(out, /property="og:title" content="Эволюция"/);
  assert.match(out, /property="og:site_name" content="Эволюция"/);
});

test("rejects Vercel system hosts as og:image origins", () => {
  assert.equal(publicAppHost("01a020b6-803a-71a2-bb47-e2bec57eb9a2-662k8x1l1-xai-org.vercel.app"), "");
  assert.equal(publicAppHost("demo.vercel.app:443"), "");
  assert.equal(publicAppHost("vercel.app"), "");
  assert.equal(publicAppHost("wild-race.grok.me"), "wild-race.grok.me");
});

test("published VITE_PUBLIC_HOSTNAME wins over request Host for og:image", () => {
  const prev = process.env.VITE_PUBLIC_HOSTNAME;
  process.env.VITE_PUBLIC_HOSTNAME = "plum-plaza-reef-dream.grok.me";
  try {
    const vercelHost = injectGrokPwaHead("<html><head><title>RACK</title></head></html>", {
      host: "01a020b6-803a-71a2-bb47-e2bec57eb9a2-662k8x1l1-xai-org.vercel.app",
      site: { title: "RACK", card: "custom" },
    });
    assert.match(
      vercelHost,
      /property="og:image" content="https:\/\/plum-plaza-reef-dream\.grok\.me\/__grok\/og\.jpg"/,
    );
    assert.doesNotMatch(vercelHost, /vercel\.app/);

    const otherPublicHost = injectGrokPwaHead("<html><head><title>RACK</title></head></html>", {
      host: "custom.example.com",
      site: { title: "RACK", card: "custom" },
    });
    assert.match(
      otherPublicHost,
      /property="og:image" content="https:\/\/plum-plaza-reef-dream\.grok\.me\/__grok\/og\.jpg"/,
    );
    assert.doesNotMatch(otherPublicHost, /custom\.example\.com/);
  } finally {
    if (prev === undefined) delete process.env.VITE_PUBLIC_HOSTNAME;
    else process.env.VITE_PUBLIC_HOSTNAME = prev;
  }
});

test("request hosts never become metadata origins without explicit configuration", () => {
  const prev = process.env.VITE_PUBLIC_HOSTNAME;
  delete process.env.VITE_PUBLIC_HOSTNAME;
  try {
    for (const host of [
      "attacker.example",
      "evolution.grok.me",
      "01a020b6-803a-71a2-bb47-e2bec57eb9a2-662k8x1l1-xai-org.vercel.app",
    ]) {
      const out = injectGrokPwaHead("<html><head><title>RACK</title></head></html>", {
        host,
        pageUrl: "/rules?utm_source=test",
        site: { title: "RACK", card: "custom", banner: "/__grok/x-banner.jpg" },
      });
      assert.doesNotMatch(out, /property="og:image"/);
      assert.doesNotMatch(out, /property="og:url"/);
      assert.doesNotMatch(out, /property="x:game:image"/);
      assert.doesNotMatch(out, new RegExp(host.replaceAll(".", "\\.")));
    }
  } finally {
    if (prev === undefined) delete process.env.VITE_PUBLIC_HOSTNAME;
    else process.env.VITE_PUBLIC_HOSTNAME = prev;
  }
});

test("configured public host enables a fallback og:url without duplicating route og:url", () => {
  const prev = process.env.VITE_PUBLIC_HOSTNAME;
  process.env.VITE_PUBLIC_HOSTNAME = "evolution.grok.me";
  try {
    const generated = injectGrokPwaHead("<html><head><title>Rules</title></head></html>", {
      host: "attacker.example",
      pageUrl: "/rules?utm_source=test",
      site: { title: "Эволюция" },
    });
    assert.match(
      generated,
      /property="og:url" content="https:\/\/evolution\.grok\.me\/rules\?utm_source=test"/,
    );
    assert.doesNotMatch(generated, /attacker\.example/);

    const route = injectGrokPwaHead(
      '<html><head><meta property="og:url" content="https://evolution.example/rules"></head></html>',
      {
        host: "attacker.example",
        pageUrl: "/rules?utm_source=test",
      },
    );
    assert.match(route, /property="og:url" content="https:\/\/evolution\.example\/rules"/);
    assert.equal(route.split('property="og:url"').length - 1, 1);
  } finally {
    if (prev === undefined) delete process.env.VITE_PUBLIC_HOSTNAME;
    else process.env.VITE_PUBLIC_HOSTNAME = prev;
  }
});

test("room query injects noindex,follow once while tracking query does not", () => {
  const room = injectGrokPwaHead("<html><head><title>Room</title></head></html>", {
    pageUrl: "/?room=FVWG&utm_source=invite",
  });
  assert.match(room, /name="robots" content="noindex,follow"/);
  const twice = injectGrokPwaHead(room, { pageUrl: "/?room=FVWG" });
  assert.equal(twice.split('name="robots"').length - 1, 1);

  const tracking = injectGrokPwaHead("<html><head><title>Home</title></head></html>", {
    pageUrl: "/?utm_source=test",
  });
  assert.doesNotMatch(tracking, /name="robots" content="noindex,follow"/);
});

test("emits the workspace custom image fallback for a configured public host", () => {
  const fallback = withPublicHostname("wild-race.grok.me", () =>
    injectGrokPwaHead("<html><head></head></html>", {
      appName: "Wild Race",
      host: "attacker.example",
      site: { title: "Wild Race" },
    }),
  );
  assert.match(
    fallback,
    /property="og:image" content="https:\/\/wild-race\.grok\.me\/__grok\/og\.jpg"/,
  );
  assert.match(fallback, /property="og:image:width" content="1200"/);

  const custom = withPublicHostname("wild-race.grok.me", () =>
    injectGrokPwaHead("<html><head></head></html>", {
      appName: "Wild Race",
      host: "attacker.example",
      site: { title: "Wild Race", card: "custom", type: "x:game" },
    }),
  );
  assert.match(custom, /property="og:image" content="https:\/\/wild-race\.grok\.me\/__grok\/og\.jpg"/);
  assert.match(custom, /property="og:type" content="x:game"/);
});

test("site.color is ignored when a workspace custom card exists", () => {
  const themed = withPublicHostname("wild-race.grok.me", () =>
    injectGrokPwaHead("<html><head></head></html>", {
      host: "attacker.example",
      site: { title: "Wild Race", color: "#FF4D2E" },
    }),
  );
  assert.match(
    themed,
    /property="og:image" content="https:\/\/wild-race\.grok\.me\/__grok\/og\.jpg"/,
  );
  assert.doesNotMatch(themed, /(?:\?|&amp;)color=/);

  const invalid = withPublicHostname("wild-race.grok.me", () =>
    injectGrokPwaHead("<html><head></head></html>", {
      host: "attacker.example",
      site: { title: "Wild Race", color: "red" },
    }),
  );
  assert.doesNotMatch(invalid, /(?:\?|&amp;)color=/);

  const custom = withPublicHostname("wild-race.grok.me", () =>
    injectGrokPwaHead("<html><head></head></html>", {
      host: "attacker.example",
      site: { title: "Wild Race", card: "custom", color: "FF4D2E" },
    }),
  );
  assert.doesNotMatch(custom, /(?:\?|&amp;)color=/);
});

test("document title entities are not double-escaped on og:title", () => {
  const out = injectGrokPwaHead(
    "<html><head><title>Cats &amp; Dogs</title></head></html>",
  );
  assert.match(out, /property="og:title" content="Cats &amp; Dogs"/);
  assert.doesNotMatch(out, /Cats &amp;amp; Dogs/);
});

test("site.json title wins over the host slug", () => {
  const out = injectGrokPwaHead("<html><head></head></html>", {
    host: "wild-race.grok.me",
    site: { title: "Pixel Nova" },
  });
  assert.match(out, /property="og:title" content="Pixel Nova"/);
});

test("injects into documents with no head element", () => {
  const out = injectGrokPwaHead("<html><body>hi</body></html>", {
    appName: "Solo",
    site: {},
  });
  assert.match(out, /<head>/);
  assert.match(out, /property="og:title" content="Solo"/);
  assert.match(out, /<\/head>/);
});

test("streaming injector matches </HEAD> case-insensitively", () => {
  const injector = createHeadInjector({ appName: "Wild Race" });
  const chunks = [
    ...injector.push("<html><HEAD><title>x</title></HE"),
    ...injector.push("AD><body>hello</body></html>"),
  ];
  const out = Buffer.concat(chunks).toString("utf8");
  assert.match(out, /property="og:title" content="x"/);
  assert.match(out, /<body>hello<\/body>/);
});

test("does not duplicate the extensions script", () => {
  const ctx = { appName: "Demo", projectId: "proj-123" };
  const once = injectGrokPwaHead("<html><head></head></html>", ctx);
  const twice = injectGrokPwaHead(once, ctx);
  assert.equal(once, twice);
  assert.equal(twice.split("extensions.js").length - 1, 1);
});

test("is idempotent", () => {
  const once = injectGrokPwaHead("<html><head></head></html>");
  const twice = injectGrokPwaHead(once);
  assert.equal(once, twice);
});

test("uses the document title for generated share tags and site title for PWA chrome", () => {
  const out = injectGrokPwaHead("<html><head><title>Route</title></head></html>", {
    appName: "Wild Race",
    site: {},
  });
  assert.match(out, /property="og:title" content="Route"/);
  assert.match(out, /apple-mobile-web-app-title" content="Route"/);
});

test("streaming injector handles </head> split across chunks", () => {
  const injector = createHeadInjector({ appName: "Wild Race" });
  const chunks = [
    ...injector.push("<html><head><title>x</title></he"),
    ...injector.push("ad><body>hello</body></html>"),
  ];
  const out = Buffer.concat(chunks).toString("utf8");
  assert.match(out, /rel="manifest"/);
  assert.ok(out.indexOf("manifest") < out.indexOf("</head>"));
  assert.match(out, /<body>hello<\/body>/);
  assert.deepEqual(injector.flush(), []);
});

test("streaming injector passes post-head chunks through untouched", () => {
  const injector = createHeadInjector();
  injector.push("<html><head></head>");
  const [tail] = injector.push("<body>tail</body>");
  assert.equal(tail.toString("utf8"), "<body>tail</body>");
});

test("streaming injector falls back when no </head> is seen", () => {
  const injector = createHeadInjector();
  assert.deepEqual(injector.push("<html><head>"), []);
  const out = Buffer.concat(injector.flush()).toString("utf8");
  assert.match(out, /rel="manifest"/);
});

test("install tutorial is gated to the root pathname", () => {
  assert.equal(isInstallQuery("/?install=1&platform=ios"), true);
  assert.equal(isInstallQuery("/app?foo=1&install=true&platform=ios"), true);
  assert.equal(isInstallTutorialRequest("/?install=1"), true);
  assert.equal(isInstallTutorialRequest("/?install=true&platform=android"), true);
  assert.equal(isInstallTutorialRequest("/not-a-route?install=1"), false);
  assert.equal(isInstallTutorialRequest("/app?install=true"), false);
  assert.equal(isInstallTutorialRequest("/?install=0&platform=ios"), false);
  assert.equal(isInstallTutorialRequest("/"), false);
});

test("filters non-document paths", () => {
  assert.equal(isDocumentPath("/"), true);
  assert.equal(isDocumentPath("/app"), true);
  assert.equal(isDocumentPath("/api/thing"), false);
  assert.equal(isDocumentPath("/__grok/install/styles.css"), false);
  assert.equal(isDocumentPath("/logo.png"), false);
});

test("strips install params from the app link", () => {
  assert.equal(stripInstallParams("/?install=1&platform=ios"), "/");
  assert.equal(stripInstallParams("/app?install=1&platform=ios&tab=2"), "/app?tab=2");
});

test("names published grok.me hosts without trusting other hosts", () => {
  assert.equal(appNameFromHost("localhost:8080"), "Эволюция");
  assert.equal(appNameFromHost("172.17.154.217:8080"), "Эволюция");
  assert.equal(appNameFromHost("wild-race.grok.me"), "Wild Race");
});

test("rejects hosts that are not plain slugs", () => {
  assert.equal(appNameFromHost("<script>alert(1)</script>"), "Эволюция");
  assert.equal(appNameFromHost('"><img src=x onerror=1>.grok.me'), "Эволюция");
});

test("renders root install tutorial with noindex", () => {
  const html = renderInstallPage("wild-race.grok.me", "/?install=1&platform=ios");
  assert.match(html, /Добавить Эволюцию/);
  assert.match(html, /\/__grok\/install\/styles\.css/);
  assert.match(html, /href="\/"/);
  assert.match(html, /name="robots" content="noindex,follow"/);
  assert.equal(html.includes("{{APP_NAME}}"), false);
  assert.equal(html.includes("{{APP_URL}}"), false);
});

test("escapes host-derived values in the install page", () => {
  const html = renderInstallPage("<script>alert(1)</script>", "/?install=1&platform=ios");
  assert.equal(html.includes("<script>alert(1)</script>"), false);
});

test("renders the manifest with the fixed product name", () => {
  const manifest = JSON.parse(renderWebManifest("wild-race.grok.me"));
  assert.equal(manifest.name, "Эволюция");
  assert.equal(manifest.short_name, "Эволюция");
  assert.equal(manifest.icons[0].src, "/__grok/icon-180.png");
});

// Tripwires: the deployed-app path only works if Nitro scans server/ — an
// accidental edit that drops serverDir or the middleware file would otherwise
// fail silently (published apps would just render the app for ?install=1).
test("vite config keeps the nitro serverDir wiring", () => {
  const viteConfig = readFileSync(join(TEMPLATE_ROOT, "vite.config.ts"), "utf8");
  assert.match(viteConfig, /serverDir:\s*"\.\/server"/);
  assert.match(viteConfig, /grokPwaPlugin\(\)/);
});

test("nitro middleware and its bundled assets exist", () => {
  const middleware = readFileSync(join(TEMPLATE_ROOT, "server/middleware/grok-pwa.ts"), "utf8");
  assert.match(middleware, /install-page\.html\?raw/);
  assert.match(middleware, /virtual:grok-og-identity/);
  readFileSync(join(TEMPLATE_ROOT, "scripts/install-page.html"));
  readFileSync(join(TEMPLATE_ROOT, "public/__grok/icon-180.png"));
  readFileSync(join(TEMPLATE_ROOT, "public/__grok/install/styles.css"));
});

test("vite plugin and nitro middleware keep request-context parity", () => {
  const plugin = readFileSync(join(TEMPLATE_ROOT, "scripts/grok-pwa-plugin.mjs"), "utf8");
  const middleware = readFileSync(join(TEMPLATE_ROOT, "server/middleware/grok-pwa.ts"), "utf8");
  assert.match(plugin, /virtual:grok-og-identity/);
  assert.match(plugin, /snapshotOgIdentity/);
  assert.match(plugin, /isInstallTutorialRequest\(rawUrl\)/);
  assert.match(plugin, /pageUrl:\s*rawUrl/);
  assert.match(plugin, /setHeader\("vary", "Accept-Language"\)/);
  assert.match(middleware, /isInstallTutorialRequest\(urlWithQuery\)/);
  assert.match(middleware, /injectHeadStreaming\(result, requestHost\(event\), urlWithQuery\)/);
  assert.match(middleware, /vary:\s*"Accept-Language"/);
});

