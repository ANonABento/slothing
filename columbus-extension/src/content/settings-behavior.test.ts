import { describe, expect, it } from 'vitest';
import type { DetectedField, ExtensionSettings, FieldType } from '@/shared/types';
import { DEFAULT_SETTINGS } from '@/shared/types';
import { filterDetectedFields, isScraperSourceEnabled } from './settings-behavior';

function field(fieldType: FieldType, confidence: number): DetectedField {
  return {
    element: document.createElement('input'),
    fieldType,
    confidence,
  };
}

function settings(overrides: Partial<ExtensionSettings> = {}): ExtensionSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...overrides,
  };
}

describe('filterDetectedFields', () => {
  it('filters fields below the configured confidence threshold', () => {
    expect(
      filterDetectedFields(
        [field('email', 0.49), field('firstName', 0.5), field('lastName', 0.9)],
        settings({ minimumConfidence: 0.5 })
      ).map((detectedField) => detectedField.fieldType)
    ).toEqual(['firstName', 'lastName']);
  });

  it('removes custom prompts when auto prompt detection is disabled', () => {
    expect(
      filterDetectedFields(
        [field('customQuestion', 0.95), field('email', 0.95)],
        settings({ autoDetectPrompts: false })
      ).map((detectedField) => detectedField.fieldType)
    ).toEqual(['email']);
  });
});

describe('isScraperSourceEnabled', () => {
  it('allows enabled scrape sources when scraping is globally enabled', () => {
    expect(
      isScraperSourceEnabled(
        settings({ enableJobScraping: true, enabledScraperSources: ['linkedin'] }),
        'linkedin'
      )
    ).toBe(true);
  });

  it('blocks disabled sources and global scraping opt-out', () => {
    expect(
      isScraperSourceEnabled(
        settings({ enableJobScraping: true, enabledScraperSources: ['linkedin'] }),
        'indeed'
      )
    ).toBe(false);
    expect(
      isScraperSourceEnabled(
        settings({ enableJobScraping: false, enabledScraperSources: ['linkedin'] }),
        'linkedin'
      )
    ).toBe(false);
  });
});
