import React from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { 
  ClockIcon, 
  WrenchScrewdriverIcon,
  RocketLaunchIcon 
} from '@heroicons/react/24/outline';

interface ComingSoonProps {
  title: string;
  description: string;
  features?: string[];
  estimatedDate?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ 
  title, 
  description, 
  features = [],
  estimatedDate = "Q2 2024"
}) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="max-w-2xl w-full">
        <CardContent className="p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
              <RocketLaunchIcon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {description}
          </p>

          {features.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Planned Features:
              </h3>
              <ul className="text-left space-y-2 max-w-md mx-auto">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600 dark:text-gray-400">
                    <WrenchScrewdriverIcon className="h-4 w-4 mr-3 text-blue-600 dark:text-blue-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            <ClockIcon className="h-4 w-4 mr-2" />
            Expected Release: {estimatedDate}
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 This feature is currently under development. Stay tuned for updates!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoon;