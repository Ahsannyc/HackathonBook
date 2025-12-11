import { UserBackground } from "../models/user";

/**
 * Personalization Service
 *
 * Provides methods for content personalization based on user background information.
 * This service analyzes user experience levels and preferences to customize content delivery.
 */
export class PersonalizationService {
  /**
   * Determine content difficulty level based on user background
   */
  getContentDifficulty(userBackground: UserBackground): 'beginner' | 'intermediate' | 'advanced' {
    // If any experience level is advanced/expert, return advanced
    if (userBackground.softwareExperience === 'advanced' ||
        userBackground.softwareExperience === 'expert' ||
        userBackground.hardwareExperience === 'advanced' ||
        userBackground.hardwareExperience === 'expert') {
      return 'advanced';
    }

    // If any experience level is intermediate, return intermediate
    if (userBackground.softwareExperience === 'intermediate' ||
        userBackground.hardwareExperience === 'intermediate') {
      return 'intermediate';
    }

    // Default to beginner
    return 'beginner';
  }

  /**
   * Get recommended content sections based on user background
   */
  getRecommendedContentSections(userBackground: UserBackground): string[] {
    const sections: string[] = [];

    // Based on primary focus, recommend relevant sections
    switch (userBackground.primaryFocus) {
      case 'software':
        sections.push('software-development', 'programming-concepts', 'algorithms');
        break;
      case 'hardware':
        sections.push('hardware-architecture', 'electronics', 'embedded-systems');
        break;
      case 'both':
        sections.push('software-development', 'hardware-architecture', 'system-design');
        break;
      case 'theory':
        sections.push('computer-science-theory', 'algorithms', 'mathematics');
        break;
    }

    // Add sections based on experience level
    if (userBackground.softwareExperience === 'beginner' ||
        userBackground.hardwareExperience === 'beginner') {
      sections.push('introduction', 'fundamentals', 'basics');
    }

    // Add advanced sections if user has advanced experience
    if (userBackground.softwareExperience === 'advanced' ||
        userBackground.softwareExperience === 'expert') {
      sections.push('advanced-software-topics', 'optimization', 'architecture');
    }

    if (userBackground.hardwareExperience === 'advanced' ||
        userBackground.hardwareExperience === 'expert') {
      sections.push('advanced-hardware-topics', 'performance', 'design');
    }

    // Include all sections if no specific background is provided
    if (!userBackground.softwareExperience && !userBackground.hardwareExperience && !userBackground.primaryFocus) {
      sections.push('introduction', 'software-development', 'hardware-architecture', 'system-design');
    }

    // Remove duplicates and return
    return [...new Set(sections)];
  }

  /**
   * Get personalized learning path based on user background
   */
  getPersonalizedLearningPath(userBackground: UserBackground): string[] {
    const path: string[] = [];

    // Start with introduction if user is a beginner
    if (userBackground.softwareExperience === 'beginner' ||
        userBackground.hardwareExperience === 'beginner') {
      path.push('getting-started');
    }

    // Based on primary focus, create a learning path
    switch (userBackground.primaryFocus) {
      case 'software':
        path.push(
          'programming-fundamentals',
          'software-design',
          'development-practices',
          'advanced-programming'
        );
        break;
      case 'hardware':
        path.push(
          'electronics-basics',
          'hardware-design',
          'embedded-systems',
          'advanced-hardware'
        );
        break;
      case 'both':
        path.push(
          'system-architecture',
          'software-hardware-integration',
          'full-stack-development'
        );
        break;
      case 'theory':
        path.push(
          'computer-science-fundamentals',
          'algorithms-and-data-structures',
          'computational-theory'
        );
        break;
      default:
        // If no focus is specified, provide a balanced path
        path.push(
          'introduction',
          'programming-fundamentals',
          'hardware-basics',
          'system-design'
        );
    }

    return path;
  }

  /**
   * Get content adaptation suggestions based on user background
   */
  getContentAdaptations(userBackground: UserBackground): {
    showAdvancedExamples: boolean;
    includeTheory: boolean;
    focusOnPractical: boolean;
    addExplanations: boolean;
  } {
    return {
      showAdvancedExamples: userBackground.softwareExperience === 'advanced' ||
                           userBackground.softwareExperience === 'expert' ||
                           userBackground.hardwareExperience === 'advanced' ||
                           userBackground.hardwareExperience === 'expert',
      includeTheory: userBackground.primaryFocus === 'theory' ||
                     userBackground.softwareExperience === 'advanced' ||
                     userBackground.softwareExperience === 'expert',
      focusOnPractical: userBackground.primaryFocus !== 'theory' &&
                        userBackground.softwareExperience !== 'advanced' &&
                        userBackground.softwareExperience !== 'expert',
      addExplanations: userBackground.softwareExperience === 'beginner' ||
                       userBackground.hardwareExperience === 'beginner',
    };
  }

  /**
   * Get personalized content summary based on user background
   */
  getPersonalizedContentSummary(userBackground: UserBackground): string {
    const difficulty = this.getContentDifficulty(userBackground);
    const sections = this.getRecommendedContentSections(userBackground);
    const adaptations = this.getContentAdaptations(userBackground);

    return `Based on your background in ${userBackground.softwareExperience} software and ${userBackground.hardwareExperience} hardware, with a focus on ${userBackground.primaryFocus}, we've prepared content at a ${difficulty} level. Recommended sections include: ${sections.slice(0, 3).join(', ')}. ${adaptations.addExplanations ? 'Additional explanations have been included' : 'Advanced examples are highlighted'}.`;
  }
}

// Export a singleton instance of the PersonalizationService
export const personalizationService = new PersonalizationService();