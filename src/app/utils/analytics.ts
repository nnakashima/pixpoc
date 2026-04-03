/**
 * Analytics utilities for Google Analytics 4 and Microsoft Clarity
 * Tracks custom events across the PixPoc application
 */

// Declare gtag globally
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    clarity?: (...args: any[]) => void;
  }
}

/**
 * Track custom events in Google Analytics 4
 */
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, parameters);
      console.log('📊 GA4 Event:', eventName, parameters);
    }
  } catch (error) {
    console.error('Error tracking GA4 event:', error);
  }
};

/**
 * Track page views in Google Analytics 4
 */
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: pagePath,
        page_title: pageTitle || document.title,
      });
    }
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

/**
 * Set custom user properties in Clarity
 */
export const setClarityCustomTag = (key: string, value: string) => {
  try {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('set', key, value);
    }
  } catch (error) {
    console.error('Error setting Clarity custom tag:', error);
  }
};

// ============================================
// PIXPOC SPECIFIC EVENT TRACKERS
// ============================================

/**
 * Track when a balloon is clicked
 */
export const trackBalloonClick = (balloonNumber: number, color: string) => {
  trackEvent('balao_click', {
    balloon_number: balloonNumber,
    balloon_color: color,
  });
};

/**
 * Track when a balloon is popped and reveals a prize
 */
export const trackBalloonPop = (
  balloonNumber: number,
  prize: string,
  totalPopped: number
) => {
  trackEvent('balao_estourado', {
    balloon_number: balloonNumber,
    prize_value: prize,
    total_popped: totalPopped,
  });
};

/**
 * Track when a new raffle/draw is created (reset)
 */
export const trackRaffleCreated = (
  balloonCount: number,
  singleColor: boolean,
  prizeCount: number
) => {
  trackEvent('sorteio_criado', {
    balloon_count: balloonCount,
    single_color: singleColor,
    prize_count: prizeCount,
  });
};

/**
 * Track when a prize is awarded to a winner
 */
export const trackPrizeAwarded = (prize: string, hasWinnerData: boolean) => {
  trackEvent('premio_sorteado', {
    prize_value: prize,
    winner_data_filled: hasWinnerData,
  });
};

/**
 * Track banner impressions
 */
export const trackBannerView = (bannerUrl: string, viewCount: number) => {
  trackEvent('banner_view', {
    banner_url: bannerUrl,
    view_count: viewCount,
  });
};

/**
 * Track banner clicks
 */
export const trackBannerClick = (bannerUrl: string, linkUrl: string) => {
  trackEvent('banner_click', {
    banner_url: bannerUrl,
    link_url: linkUrl,
  });
};

/**
 * Track when user accesses banner configuration
 */
export const trackBannerConfigAccess = (success: boolean) => {
  trackEvent('config_banner_access', {
    access_granted: success,
  });
};

/**
 * Track password attempts
 */
export const trackPasswordAttempt = (success: boolean) => {
  trackEvent('senha_tentativa', {
    success: success,
  });
};

/**
 * Track settings changes
 */
export const trackSettingsChange = (
  setting: string,
  value: string | number | boolean
) => {
  trackEvent('configuracao_alterada', {
    setting_name: setting,
    setting_value: value,
  });
};

/**
 * Track winner information saved
 */
export const trackWinnerInfoSaved = (
  hasName: boolean,
  hasReference: boolean,
  hasPixKey: boolean
) => {
  trackEvent('ganhador_salvo', {
    has_name: hasName,
    has_reference: hasReference,
    has_pix_key: hasPixKey,
  });
};

/**
 * Track when user highlights a balloon
 */
export const trackBalloonHighlight = (
  balloonNumber: number,
  prize: string,
  highlighted: boolean
) => {
  trackEvent('balao_destacado', {
    balloon_number: balloonNumber,
    prize_value: prize,
    highlighted: highlighted,
  });
};

/**
 * Track help/tutorial access
 */
export const trackHelpAccess = () => {
  trackEvent('ajuda_acessada', {
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track sound toggle
 */
export const trackSoundToggle = (enabled: boolean) => {
  trackEvent('som_alterado', {
    sound_enabled: enabled,
  });
};

/**
 * Track color mode toggle
 */
export const trackColorModeToggle = (singleColor: boolean) => {
  trackEvent('modo_cor_alterado', {
    single_color: singleColor,
  });
};

/**
 * Track errors
 */
export const trackError = (errorType: string, errorMessage: string) => {
  trackEvent('erro_aplicacao', {
    error_type: errorType,
    error_message: errorMessage,
  });
};
