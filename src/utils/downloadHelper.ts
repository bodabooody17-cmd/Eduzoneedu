import { SummaryItem } from '../types';

export function downloadSummaryAsDocument(item: SummaryItem) {
  const contentHtml = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${item.title} - منصة EduZone التعليمية</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Cairo', system-ui, sans-serif;
      margin: 40px;
      color: #1e293b;
      line-height: 1.8;
      background: #ffffff;
    }
    .header {
      border-bottom: 3px solid #4f46e5;
      padding-bottom: 20px;
      margin-bottom: 30px;
      text-align: center;
    }
    .badge {
      display: inline-block;
      background: #eef2ff;
      color: #4338ca;
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 10px;
    }
    h1 {
      color: #1e1b4b;
      font-size: 26px;
      margin: 8px 0;
    }
    .meta {
      font-size: 13px;
      color: #64748b;
    }
    .page-box {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 24px;
      margin-bottom: 28px;
      page-break-inside: avoid;
    }
    .page-title {
      font-size: 18px;
      color: #4338ca;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 8px;
      margin-bottom: 14px;
      font-weight: 700;
    }
    .point {
      margin-bottom: 10px;
      padding-right: 14px;
      position: relative;
    }
    .point::before {
      content: "•";
      color: #4f46e5;
      position: absolute;
      right: 0;
      font-size: 20px;
      line-height: 1;
    }
    .formulas {
      background: #fef3c7;
      border: 1px solid #fde68a;
      border-radius: 8px;
      padding: 12px;
      margin-top: 14px;
      font-family: monospace;
      font-weight: bold;
      color: #78350f;
    }
    .tip {
      background: #e0e7ff;
      border-radius: 8px;
      padding: 12px;
      margin-top: 14px;
      font-size: 14px;
      color: #312e81;
    }
    .footer {
      text-align: center;
      margin-top: 50px;
      font-size: 12px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      padding-top: 20px;
    }
    @media print {
      body { margin: 15mm; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="badge">${item.trackLabel} | ${item.subject}</div>
    <h1>${item.title}</h1>
    <div class="meta">
      إعداد: ${item.author} | عدد الصفحات: ${item.pagesCount} | العام الدراسي: ${item.year} | منصة EduZone (م. عبد الله)
    </div>
  </div>
  <div class="content">
    ${item.pages
      .map(
        (p) => `
      <div class="page-box">
        <div class="page-title">صفحة رقم ${p.pageNumber}: ${p.title}</div>
        ${p.content.map((c) => `<div class="point">${c}</div>`).join('')}
        ${
          p.keyFormulas && p.keyFormulas.length
            ? `<div class="formulas">القوانين والمفاهيم الأساسية: ${p.keyFormulas.join(' | ')}</div>`
            : ''
        }
        ${
          p.examTip
            ? `<div class="tip">💡 نصيحة امتحانية هامة: ${p.examTip}</div>`
            : ''
        }
      </div>
    `
      )
      .join('')}
  </div>
  <div class="footer">
    حقوق الطبع والنشر &copy; ${item.year} - منصة EduZone التعليمية (المهندس عبد الله) - للاستفسارات تليجرام: https://t.me/+2OhLLu7ofSoxNTNk
  </div>
</body>
</html>
  `;
  const blob = new Blob([contentHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${item.subject}_ملخص_${item.year}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
