'use client';

import React from 'react';
import { CourseView } from '../../../components/CourseView';
import { VIDEO_COURSES } from '../../../src/data/coursesData';

interface PageProps {
  params: {
    id: string;
  };
}

export default function CoursePage({ params }: PageProps) {
  const course = VIDEO_COURSES.find((c) => c.id === params?.id) || VIDEO_COURSES[0];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-6">
      <CourseView course={course} />
    </main>
  );
}
