"use client"

import { UIProvider } from '@/context/UIContext';
import GridExample from './dashboard/page';
import { ClickToComponent } from 'click-to-react-component'

export default function Home() {
  return (
    <UIProvider>
      <ClickToComponent editor="trae" />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 px-2 sm:px-6 lg:px-8">
        <div className="max-w-full mx-auto">
          <div className="grid grid-cols-1">
            <GridExample />
          </div>
        </div>
      </div>
    </UIProvider>
  );
}
