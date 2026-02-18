import type { EmergencyResult } from '@/types';

const EMERGENCY_PATTERNS = {
  chest_pain: {
    keywords: [
      'chest pain', 'heart attack', 'cardiac arrest', 'crushing chest',
      'chest pressure', 'chest tightness', 'pain in chest'
    ],
    type: 'Cardiac Emergency',
    message: 'Chest pain can indicate a heart attack. Call emergency services immediately!'
  },
  stroke: {
    keywords: [
      'stroke', 'face drooping', 'arm weakness', 'speech difficulty',
      'sudden numbness', 'sudden confusion', 'trouble speaking',
      'vision problems sudden', 'severe headache sudden'
    ],
    type: 'Stroke',
    message: 'These symptoms may indicate a stroke. Call emergency services immediately!'
  },
  breathing: {
    keywords: [
      'can\'t breathe', 'cannot breathe', 'difficulty breathing',
      'shortness of breath severe', 'gasping for air', 'choking',
      'suffocating', 'breathing problem'
    ],
    type: 'Respiratory Emergency',
    message: 'Severe breathing difficulty requires immediate medical attention!'
  },
  bleeding: {
    keywords: [
      'severe bleeding', 'heavy bleeding', 'bleeding won\'t stop',
      'blood gushing', 'hemorrhage', 'bleeding profusely'
    ],
    type: 'Severe Bleeding',
    message: 'Severe bleeding requires immediate medical attention!'
  },
  suicide: {
    keywords: [
      'want to die', 'kill myself', 'suicide', 'end my life',
      'self harm', 'hurt myself', 'don\'t want to live'
    ],
    type: 'Mental Health Crisis',
    message: 'Please call emergency services or a suicide prevention hotline immediately. You are not alone.'
  },
  seizure: {
    keywords: [
      'seizure', 'convulsion', 'fitting', 'uncontrollable shaking',
      'loss of consciousness', 'collapsed'
    ],
    type: 'Seizure',
    message: 'Active seizures require immediate medical attention!'
  },
  overdose: {
    keywords: [
      'overdose', 'took too many pills', 'poisoning', 'swallowed poison',
      'drug overdose', 'medication overdose'
    ],
    type: 'Overdose/Poisoning',
    message: 'Overdose or poisoning requires immediate emergency care!'
  },
  vomiting_blood: {
    keywords: [
      'vomiting blood', 'throwing up blood', 'blood in vomit',
      'coughing up blood', 'hematemesis'
    ],
    type: 'Internal Bleeding',
    message: 'Vomiting blood indicates serious internal bleeding. Seek emergency care immediately!'
  },
  severe_burns: {
    keywords: [
      'severe burn', 'third degree burn', 'burned badly',
      'skin peeling off', 'large burn'
    ],
    type: 'Severe Burns',
    message: 'Severe burns require immediate medical attention!'
  }
};

export function detectEmergency(text: string): EmergencyResult {
  const lowerText = text.toLowerCase();

  for (const [key, pattern] of Object.entries(EMERGENCY_PATTERNS)) {
    for (const keyword of pattern.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        return {
          isEmergency: true,
          emergencyType: pattern.type,
          message: pattern.message
        };
      }
    }
  }

  return { isEmergency: false };
}
