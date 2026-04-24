"use client";

import { HousingApplicationForm } from './housing-application-form';

export function NewApplicationPanel() {
  return (
    <section className="panel p-6 md:p-8">
      <HousingApplicationForm />
    </section>
  );
}
