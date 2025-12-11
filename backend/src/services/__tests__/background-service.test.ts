import { personalizationService } from '../personalization-service';

describe('PersonalizationService', () => {
  describe('getContentDifficulty', () => {
    it('should return advanced if any experience level is advanced or expert', () => {
      const result = personalizationService.getContentDifficulty({
        id: 'test',
        userId: 'test',
        softwareExperience: 'expert',
        hardwareExperience: 'beginner',
        primaryFocus: 'both',
        backgroundDetails: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(result).toBe('advanced');
    });

    it('should return intermediate if any experience level is intermediate', () => {
      const result = personalizationService.getContentDifficulty({
        id: 'test',
        userId: 'test',
        softwareExperience: 'intermediate',
        hardwareExperience: 'beginner',
        primaryFocus: 'both',
        backgroundDetails: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(result).toBe('intermediate');
    });

    it('should return beginner if all experience levels are beginner', () => {
      const result = personalizationService.getContentDifficulty({
        id: 'test',
        userId: 'test',
        softwareExperience: 'beginner',
        hardwareExperience: 'beginner',
        primaryFocus: 'both',
        backgroundDetails: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(result).toBe('beginner');
    });
  });

  describe('getRecommendedContentSections', () => {
    it('should recommend software sections for software focus', () => {
      const result = personalizationService.getRecommendedContentSections({
        id: 'test',
        userId: 'test',
        softwareExperience: 'beginner',
        hardwareExperience: 'beginner',
        primaryFocus: 'software',
        backgroundDetails: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(result).toContain('software-development');
    });

    it('should recommend hardware sections for hardware focus', () => {
      const result = personalizationService.getRecommendedContentSections({
        id: 'test',
        userId: 'test',
        softwareExperience: 'beginner',
        hardwareExperience: 'beginner',
        primaryFocus: 'hardware',
        backgroundDetails: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(result).toContain('hardware-architecture');
    });

    it('should recommend both sections for both focus', () => {
      const result = personalizationService.getRecommendedContentSections({
        id: 'test',
        userId: 'test',
        softwareExperience: 'beginner',
        hardwareExperience: 'beginner',
        primaryFocus: 'both',
        backgroundDetails: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(result).toContain('software-development');
      expect(result).toContain('hardware-architecture');
    });
  });

  describe('getPersonalizedLearningPath', () => {
    it('should create a software-focused learning path', () => {
      const result = personalizationService.getPersonalizedLearningPath({
        id: 'test',
        userId: 'test',
        softwareExperience: 'beginner',
        hardwareExperience: 'beginner',
        primaryFocus: 'software',
        backgroundDetails: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(result).toContain('programming-fundamentals');
    });

    it('should create a hardware-focused learning path', () => {
      const result = personalizationService.getPersonalizedLearningPath({
        id: 'test',
        userId: 'test',
        softwareExperience: 'beginner',
        hardwareExperience: 'beginner',
        primaryFocus: 'hardware',
        backgroundDetails: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(result).toContain('electronics-basics');
    });
  });

  describe('getContentAdaptations', () => {
    it('should show advanced examples for advanced users', () => {
      const result = personalizationService.getContentAdaptations({
        id: 'test',
        userId: 'test',
        softwareExperience: 'advanced',
        hardwareExperience: 'beginner',
        primaryFocus: 'both',
        backgroundDetails: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(result.showAdvancedExamples).toBe(true);
    });

    it('should add explanations for beginners', () => {
      const result = personalizationService.getContentAdaptations({
        id: 'test',
        userId: 'test',
        softwareExperience: 'beginner',
        hardwareExperience: 'beginner',
        primaryFocus: 'both',
        backgroundDetails: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(result.addExplanations).toBe(true);
    });
  });

  describe('getPersonalizedContentSummary', () => {
    it('should generate a personalized content summary', () => {
      const result = personalizationService.getPersonalizedContentSummary({
        id: 'test',
        userId: 'test',
        softwareExperience: 'intermediate',
        hardwareExperience: 'beginner',
        primaryFocus: 'software',
        backgroundDetails: 'Some background details',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(result).toContain('intermediate');
      expect(result).toContain('software');
    });
  });
});