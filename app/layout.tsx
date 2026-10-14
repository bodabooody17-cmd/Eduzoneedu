import React from 'react';

export const metadata = {
  title: 'Eduzone التعليميه | المنصة الشاملة للثانوية العامة والدبلومات الفنية',
  description: 'منصة EduZone التعليمية الشاملة للثانوية العامة والدبلومات الفنية والدورات الجامعية وبنك الأسئلة',
};

export default function RootLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Google Analytics gtag.js */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-W0FV8NTC0M"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-W0FV8NTC0M');
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
