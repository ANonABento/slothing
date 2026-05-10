import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type JsonRecord = {
  [key: string]: string | JsonRecord;
};

const targetLocales = ["es", "zh-CN", "pt-BR", "hi", "fr", "ja", "ko"];

const localeOverrides: Record<string, Record<string, string>> = {
  es: {
    "nav.groups.home": "Inicio",
    "nav.groups.documents": "Documentos",
    "nav.groups.pipeline": "Pipeline",
    "nav.groups.prep": "Preparación",
    "nav.groups.reporting": "Informes",
    "nav.items.dashboard": "Tablero",
    "nav.items.documents": "Documentos",
    "nav.items.answerBank": "Banco de respuestas",
    "nav.items.studio": "Estudio de documentos",
    "nav.items.opportunities": "Oportunidades",
    "nav.items.reviewQueue": "Cola de revisión",
    "nav.items.calendar": "Calendario",
    "nav.items.emails": "Plantillas de correo",
    "nav.items.interview": "Preparación para entrevistas",
    "nav.items.salary": "Herramientas salariales",
    "nav.items.analytics": "Analítica",
    "nav.items.profile": "Perfil",
    "nav.items.settings": "Configuración",
    "dashboard.title": "Tablero",
    "dashboard.actions.addOpportunity": "Agregar oportunidad",
    "dashboard.actions.uploadDocument": "Subir documento",
    "opportunities.title": "Oportunidades",
    "opportunities.description":
      "Revisa oportunidades guardadas, compara señales de ajuste y mantén el trabajo de postulación en movimiento desde una lista.",
    "opportunities.addOpportunity": "Agregar oportunidad",
    "opportunities.filters.panel": "Filtros",
    "opportunities.filters.type": "Tipo",
    "opportunities.filters.status": "Estado",
    "opportunities.filters.source": "Fuente",
    "opportunities.filters.tags": "Etiquetas",
    "opportunities.filters.remote": "Tipo remoto",
    "opportunities.filters.tech": "Stack técnico",
    "opportunities.filters.searchPlaceholder":
      "Buscar título, empresa, habilidades",
    "opportunities.tabs.job": "Roles",
    "opportunities.tabs.hackathon": "Hackatones",
    "opportunities.tabs.all": "Todo",
    "opportunities.status.pending": "Pendiente",
    "opportunities.status.saved": "Guardado",
    "opportunities.status.applied": "Postulado",
    "opportunities.status.interviewing": "Entrevistas",
    "opportunities.status.offer": "Oferta",
    "opportunities.status.rejected": "Rechazado",
    "settings.title": "Configuración",
    "settings.description":
      "Configura tu proveedor de IA para analizar currículums y preparar entrevistas.",
    "settings.loading": "Cargando configuración...",
    "settings.language.title": "Idioma",
    "settings.language.description":
      "Elige el idioma usado para la navegación y las pantallas de la app.",
    "settings.language.label": "Idioma",
  },
  "zh-CN": {
    "nav.items.dashboard": "仪表板",
    "nav.items.opportunities": "机会",
    "nav.items.settings": "设置",
    "dashboard.title": "仪表板",
    "opportunities.title": "机会",
    "settings.title": "设置",
    "settings.language.title": "语言",
  },
  "pt-BR": {
    "nav.items.dashboard": "Painel",
    "nav.items.opportunities": "Oportunidades",
    "nav.items.settings": "Configurações",
    "dashboard.title": "Painel",
    "opportunities.title": "Oportunidades",
    "settings.title": "Configurações",
    "settings.language.title": "Idioma",
  },
  hi: {
    "nav.items.dashboard": "डैशबोर्ड",
    "nav.items.opportunities": "अवसर",
    "nav.items.settings": "सेटिंग्स",
    "dashboard.title": "डैशबोर्ड",
    "opportunities.title": "अवसर",
    "settings.title": "सेटिंग्स",
    "settings.language.title": "भाषा",
  },
  fr: {
    "nav.items.dashboard": "Tableau de bord",
    "nav.items.opportunities": "Opportunités",
    "nav.items.settings": "Paramètres",
    "dashboard.title": "Tableau de bord",
    "opportunities.title": "Opportunités",
    "settings.title": "Paramètres",
    "settings.language.title": "Langue",
  },
  ja: {
    "nav.items.dashboard": "ダッシュボード",
    "nav.items.opportunities": "機会",
    "nav.items.settings": "設定",
    "dashboard.title": "ダッシュボード",
    "opportunities.title": "機会",
    "settings.title": "設定",
    "settings.language.title": "言語",
  },
  ko: {
    "nav.items.dashboard": "대시보드",
    "nav.items.opportunities": "기회",
    "nav.items.settings": "설정",
    "dashboard.title": "대시보드",
    "opportunities.title": "기회",
    "settings.title": "설정",
    "settings.language.title": "언어",
  },
};

function applyOverrides(
  source: JsonRecord,
  overrides: Record<string, string>,
  prefix = "",
): JsonRecord {
  return Object.fromEntries(
    Object.entries(source).map(([key, value]) => {
      const pathKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === "string") {
        return [key, overrides[pathKey] ?? value];
      }

      return [key, applyOverrides(value, overrides, pathKey)];
    }),
  );
}

async function main() {
  const messagesDir = path.join(process.cwd(), "src/messages");
  const en = JSON.parse(
    await readFile(path.join(messagesDir, "en.json"), "utf8"),
  ) as JsonRecord;

  await mkdir(messagesDir, { recursive: true });

  for (const locale of targetLocales) {
    const translated = applyOverrides(en, localeOverrides[locale] ?? {});
    const payload = {
      _meta: {
        note: "Auto-translated, needs human review.",
        source: "scripted-fallback",
        generatedAt: new Date().toISOString(),
      },
      ...translated,
    };
    await writeFile(
      path.join(messagesDir, `${locale}.json`),
      `${JSON.stringify(payload, null, 2)}\n`,
    );
  }
}

void main();
