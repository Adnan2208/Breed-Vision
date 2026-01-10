/**
 * Translation Service
 * Supports Google Translate API and LibreTranslate
 */

const axios = require('axios');

class TranslateService {
  constructor() {
    this.provider = process.env.TRANSLATE_PROVIDER || 'libretranslate';
    this.googleApiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    this.libreTranslateUrl = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com';
    this.libreTranslateApiKey = process.env.LIBRETRANSLATE_API_KEY;
  }

  /**
   * Translate text to target language
   * @param {string} text - Text to translate
   * @param {string} targetLang - Target language code (hi, ta, te, etc.)
   * @param {string} sourceLang - Source language code (default: en)
   * @returns {string} Translated text
   */
  async translate(text, targetLang, sourceLang = 'en') {
    if (!text || targetLang === 'en') {
      return text;
    }

    try {
      if (this.provider === 'google') {
        return await this.googleTranslate(text, targetLang, sourceLang);
      } else {
        return await this.libreTranslate(text, targetLang, sourceLang);
      }
    } catch (error) {
      console.error('Translation error:', error.message);
      // Return original text if translation fails
      return text;
    }
  }

  /**
   * Google Translate API
   */
  async googleTranslate(text, targetLang, sourceLang) {
    if (!this.googleApiKey) {
      throw new Error('Google Translate API key not configured');
    }

    const url = 'https://translation.googleapis.com/language/translate/v2';

    const response = await axios.post(url, null, {
      params: {
        key: this.googleApiKey,
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text',
      },
      timeout: 10000,
    });

    return response.data.data.translations[0].translatedText;
  }

  /**
   * LibreTranslate API
   */
  async libreTranslate(text, targetLang, sourceLang) {
    const url = `${this.libreTranslateUrl}/translate`;

    const payload = {
      q: text,
      source: sourceLang,
      target: targetLang,
      format: 'text',
    };

    if (this.libreTranslateApiKey) {
      payload.api_key = this.libreTranslateApiKey;
    }

    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    return response.data.translatedText;
  }

  /**
   * Translate an entire advisory object
   * @param {Object} advisory - Advisory object to translate
   * @param {string} targetLang - Target language code
   * @returns {Object} Translated advisory
   */
  async translateAdvisory(advisory, targetLang) {
    if (!advisory || targetLang === 'en') {
      return advisory;
    }

    try {
      const translated = { ...advisory };

      // Translate main text fields
      const fieldsToTranslate = [
        'feedQuantity',
        'feedType',
        'healthImmunity',
        'milkYield',
        'specialCare',
        'origin',
      ];

      for (const field of fieldsToTranslate) {
        if (translated[field]) {
          translated[field] = await this.translate(translated[field], targetLang);
        }
      }

      // Translate disease risks array
      if (translated.diseaseRisks && Array.isArray(translated.diseaseRisks)) {
        translated.diseaseRisks = await Promise.all(
          translated.diseaseRisks.map((disease) => this.translate(disease, targetLang))
        );
      }

      // Translate vaccines
      if (translated.vaccines && Array.isArray(translated.vaccines)) {
        translated.vaccines = await Promise.all(
          translated.vaccines.map(async (vaccine) => ({
            name: await this.translate(vaccine.name, targetLang),
            schedule: await this.translate(vaccine.schedule, targetLang),
          }))
        );
      }

      // Translate RGM medicines
      if (translated.rgmMedicines && Array.isArray(translated.rgmMedicines)) {
        translated.rgmMedicines = await Promise.all(
          translated.rgmMedicines.map(async (medicine) => ({
            name: await this.translate(medicine.name, targetLang),
            use: await this.translate(medicine.use, targetLang),
          }))
        );
      }

      return translated;
    } catch (error) {
      console.error('Advisory translation error:', error.message);
      return advisory; // Return original if translation fails
    }
  }

  /**
   * Batch translate multiple texts
   * @param {string[]} texts - Array of texts to translate
   * @param {string} targetLang - Target language code
   * @returns {string[]} Array of translated texts
   */
  async batchTranslate(texts, targetLang) {
    if (!texts || texts.length === 0 || targetLang === 'en') {
      return texts;
    }

    try {
      // For Google Translate, we can batch
      if (this.provider === 'google' && this.googleApiKey) {
        const url = 'https://translation.googleapis.com/language/translate/v2';

        const response = await axios.post(url, null, {
          params: {
            key: this.googleApiKey,
            q: texts,
            source: 'en',
            target: targetLang,
            format: 'text',
          },
          timeout: 15000,
        });

        return response.data.data.translations.map((t) => t.translatedText);
      }

      // For LibreTranslate, translate one by one
      return await Promise.all(
        texts.map((text) => this.translate(text, targetLang))
      );
    } catch (error) {
      console.error('Batch translation error:', error.message);
      return texts;
    }
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages() {
    return {
      en: 'English',
      hi: 'हिन्दी (Hindi)',
      ta: 'தமிழ் (Tamil)',
      te: 'తెలుగు (Telugu)',
      mr: 'मराठी (Marathi)',
      gu: 'ગુજરાતી (Gujarati)',
      kn: 'ಕನ್ನಡ (Kannada)',
      pa: 'ਪੰਜਾਬੀ (Punjabi)',
      bn: 'বাংলা (Bengali)',
      or: 'ଓଡ଼ିଆ (Odia)',
    };
  }

  /**
   * Check if service is configured
   */
  isConfigured() {
    if (this.provider === 'google') {
      return !!this.googleApiKey;
    }
    return !!this.libreTranslateUrl;
  }
}

module.exports = new TranslateService();
