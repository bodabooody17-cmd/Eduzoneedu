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
              try {
                var storedSession = localStorage.getItem('eduzone_user');
                var session = storedSession ? JSON.parse(storedSession) : null;
                if (session?.user?.id || session?.contact || session?.id) {
                  gtag('config', 'G-W0FV8NTC0M', { user_id: session?.user?.id || session?.id || session?.contact });
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        {children}

        {/* Adsterra General Script - Excludes Admin & Loads asynchronously */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var userStr = localStorage.getItem('eduzone_student_user');
                  if (userStr) {
                    var user = JSON.parse(userStr);
                    if (user && (user.role === 'supervisor' || user.role === 'admin')) {
                      return; // Do not show ads for admin
                    }
                  }
                } catch(e) {}
                var script = document.createElement('script');
                script.setAttribute('data-cfasync', 'false');
                script.src = 'https://bauval.org/14/e9ec1de84fc62758951fd8327504301c';
                script.async = true;
                document.body.appendChild(script);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
