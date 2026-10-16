import assert from "node:assert/strict";
import test from "node:test";
import { detectNonEnglish } from "../lib/language";

test("English listings are not flagged for translation", () => {
  assert.equal(
    detectNonEnglish(
      "Senior Product Designer",
      "<p>You will work with our team to design the core product. We are looking for someone who cares about the details and will ship with engineering.</p>",
    ),
    null,
  );
  assert.equal(detectNonEnglish("UX Designer", ""), null);
});

test("non-Latin scripts are detected by script", () => {
  assert.equal(detectNonEnglish("资深产品设计师", "<p>负责产品的用户体验设计，与工程团队紧密合作。</p>"), "zh");
  assert.equal(detectNonEnglish("プロダクトデザイナー", "<p>ユーザー体験の設計を担当します。</p>"), "ja");
  assert.equal(detectNonEnglish("프로덕트 디자이너", "<p>사용자 경험 설계를 담당합니다.</p>"), "ko");
  assert.equal(detectNonEnglish("Дизайнер продукта", "<p>Вы будете работать с командой.</p>"), "ru");
});

test("Latin-script languages are detected by common words", () => {
  assert.equal(
    detectNonEnglish(
      "Produktdesigner (m/w/d)",
      "<p>Wir suchen eine Person, die mit uns und unserem Team an der Gestaltung arbeitet. Du bist für die Konzeption der App zuständig und arbeitest eng mit der Entwicklung zusammen, das ist nicht immer einfach.</p>",
    ),
    "de",
  );
  assert.equal(
    detectNonEnglish(
      "Diseñador de producto",
      "<p>Buscamos una persona para nuestro equipo de diseño que trabaje con los equipos de producto y que tenga experiencia en el trabajo con las herramientas del sector.</p>",
    ),
    "es",
  );
});

test("the job page offers translation beside Apply for non-English roles", async () => {
  const { readFileSync } = await import("node:fs");
  const page = readFileSync("app/jobs/[source]/[token]/[externalId]/page.tsx", "utf8");
  const floating = readFileSync("components/FloatingApply.tsx", "utf8");
  assert.match(page, /detectNonEnglish\(listing\.title, listing\.description\)/);
  assert.match(page, /data-translatable/);
  assert.match(floating, /TranslateListing/);
});
