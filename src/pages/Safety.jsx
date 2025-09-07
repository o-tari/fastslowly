import { motion } from 'framer-motion'
import { 
  Shield, 
  AlertTriangle, 
  Heart, 
  Users, 
  BookOpen,
  Phone,
  ExternalLink,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react'

const Safety = () => {
  const safetyGuidelines = [
    {
      icon: CheckCircle,
      title: 'Do',
      items: [
        'Start gradually with shorter fasting periods',
        'Stay hydrated with water, herbal teas, and electrolytes',
        'Listen to your body and stop if you feel unwell',
        'Consult your doctor before starting if you have health conditions',
        'Break your fast with nutritious, whole foods',
        'Maintain a balanced diet during eating windows',
        'Get adequate sleep and manage stress',
        'Track your progress and adjust as needed'
      ],
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      icon: XCircle,
      title: 'Don\'t',
      items: [
        'Fast if you\'re pregnant, breastfeeding, or under 18',
        'Ignore severe hunger, dizziness, or weakness',
        'Compensate by overeating during eating windows',
        'Fast if you have diabetes, eating disorders, or other medical conditions',
        'Use fasting as a quick weight loss solution',
        'Fast while taking certain medications without medical supervision',
        'Ignore professional medical advice',
        'Continue fasting if you experience adverse effects'
      ],
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800'
    }
  ]

  const warningSigns = [
    {
      symptom: 'Severe dizziness or lightheadedness',
      action: 'Stop fasting immediately and eat something'
    },
    {
      symptom: 'Extreme fatigue or weakness',
      action: 'Break your fast and rest'
    },
    {
      symptom: 'Nausea or vomiting',
      action: 'Stop fasting and consult a healthcare provider'
    },
    {
      symptom: 'Irregular heartbeat',
      action: 'Seek immediate medical attention'
    },
    {
      symptom: 'Severe headaches',
      action: 'Break your fast and stay hydrated'
    },
    {
      symptom: 'Fainting or loss of consciousness',
      action: 'Seek immediate emergency medical care'
    }
  ]

  const contraindications = [
    'Pregnancy and breastfeeding',
    'Type 1 diabetes',
    'Eating disorders (anorexia, bulimia)',
    'Underweight (BMI < 18.5)',
    'Children and adolescents under 18',
    'Certain medications (consult your doctor)',
    'Recent surgery or illness',
    'Chronic conditions affecting metabolism'
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Safety & Health Guidelines
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Important information to ensure your fasting journey is safe and healthy
        </p>
      </motion.div>

      {/* Important Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <div className="card bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                Important Medical Disclaimer
              </h2>
              <p className="text-yellow-700 dark:text-yellow-400 mb-4">
                Intermittent fasting is not suitable for everyone. This app is for informational purposes only and should not replace professional medical advice. Always consult with a qualified healthcare provider before starting any fasting regimen, especially if you have existing health conditions, are taking medications, or are pregnant/breastfeeding.
              </p>
              <div className="flex items-center space-x-2 text-sm text-yellow-700 dark:text-yellow-400">
                <Phone className="h-4 w-4" />
                <span>In case of emergency, call your local emergency services immediately.</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Safety Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Safety Guidelines
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {safetyGuidelines.map((guideline, index) => (
            <motion.div
              key={guideline.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className={`card ${guideline.bgColor} ${guideline.borderColor} border-2`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <guideline.icon className={`h-6 w-6 ${guideline.color}`} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {guideline.title}
                </h3>
              </div>
              
              <ul className="space-y-2">
                {guideline.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start space-x-2">
                    <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${guideline.color.replace('text-', 'bg-')}`} />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Warning Signs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Warning Signs to Watch For
        </h2>
        
        <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">
              Stop Fasting Immediately If You Experience:
            </h3>
          </div>
          
          <div className="space-y-3">
            {warningSigns.map((warning, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {warning.symptom}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {warning.action}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Contraindications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Who Should Not Fast
        </h2>
        
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Intermittent fasting is not recommended for:
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {contraindications.map((condition, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {condition}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Additional Resources
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="h-6 w-6 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Educational Resources
              </h3>
            </div>
            
            <div className="space-y-3">
              <a
                href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6128599/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="text-sm">Scientific Review of Intermittent Fasting</span>
              </a>
              
              <a
                href="https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/expert-answers/intermittent-fasting/faq-20441303"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="text-sm">Mayo Clinic: Intermittent Fasting Guide</span>
              </a>
              
              <a
                href="https://www.hopkinsmedicine.org/health/wellness-and-prevention/intermittent-fasting-what-is-it-and-how-does-it-work"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="text-sm">Johns Hopkins: How Intermittent Fasting Works</span>
              </a>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="h-6 w-6 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Emergency Contacts
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Phone className="h-5 w-5 text-red-500" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Emergency Services
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Call 911 (US) or your local emergency number
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Info className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Poison Control
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Call 1-800-222-1222 (US)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Final Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="text-center"
      >
        <div className="card bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Remember
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your health and safety are the top priority. This app is designed to support your intermittent fasting journey, but it cannot replace professional medical advice. Always listen to your body, consult healthcare professionals when needed, and prioritize your well-being above all else.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Safety
