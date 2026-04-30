import type { DetectedField, ExtensionSettings } from '@/shared/types';

export function filterDetectedFields(
  fields: DetectedField[],
  settings: ExtensionSettings
): DetectedField[] {
  return fields
    .filter((field) => field.confidence >= settings.minimumConfidence)
    .filter((field) => settings.autoDetectPrompts || field.fieldType !== 'customQuestion');
}

export function isScraperSourceEnabled(
  settings: ExtensionSettings,
  source: string
): boolean {
  return settings.enableJobScraping && settings.enabledScraperSources.includes(source);
}
