/**
 * Generates a responsive HTML email template with FoundryAI branding
 * - Desktop: 800px wide (16:9 widescreen landscape)
 * - Mobile: Full width portrait layout
 * @param {string} title - The main title of the email
 * @param {string} content - The HTML content of the email body
 * @param {string} preheader - Optional preheader text (preview text)
 * @returns {string} - The complete HTML email string
 */
const generateEmailTemplate = (title, content, preheader = '') => {
  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${title}</title>
  
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  
  <style type="text/css">
    /* RESET STYLES */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
    
    /* MOBILE STYLES - Portrait Layout */
    @media only screen and (max-width: 480px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
      }
      .mobile-padding {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
      .mobile-stack {
        display: block !important;
        width: 100% !important;
      }
      .mobile-center {
        text-align: center !important;
      }
      .mobile-full-width {
        width: 100% !important;
        height: auto !important;
      }
      .content-padding {
        padding: 25px 20px !important;
      }
      .header-padding {
        padding: 20px !important;
      }
      .footer-padding {
        padding: 20px !important;
      }
      h2 {
        font-size: 20px !important;
      }
      .info-table td {
        padding: 12px 15px !important;
      }
    }
    
    /* DESKTOP STYLES - 16:9 Widescreen Landscape */
    @media only screen and (min-width: 481px) {
      .email-container {
        width: 800px !important;
        max-width: 800px !important;
      }
      .desktop-wide {
        padding-left: 60px !important;
        padding-right: 60px !important;
      }
    }
  </style>
</head>

<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;">
  
  <!-- Preheader Text (Hidden - shows in email preview) -->
  <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
    ${preheader}
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <!-- Email Body -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
    <tr>
      <td style="padding: 30px 15px;">
        <div style="max-width: 800px; margin: 0 auto;">
          
          <!--[if mso]>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="800" align="center">
          <tr>
          <td>
          <![endif]-->
          
          <!-- Email Container - 800px for Desktop (16:9 widescreen), 100% for Mobile -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="email-container" style="max-width: 800px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); overflow: hidden;">
            
            <!-- Header -->
            <tr>
              <td class="header-padding" style="padding: 28px 40px; border-bottom: 1px solid #eee; background-color: #ffffff;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td>
                      <span style="font-size: 26px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.5px;">Foundry</span><span style="font-size: 26px; font-weight: 700; color: #0066ff; letter-spacing: -0.5px;">AI</span>
                    </td>
                    <td align="right" style="font-size: 12px; color: #999;">
                      ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Main Content -->
            <tr>
              <td class="content-padding desktop-wide" style="padding: 40px 50px;">
                ${content}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td class="footer-padding" style="padding: 25px 40px; background-color: #fafafa; border-top: 1px solid #eee;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="text-align: center;">
                      <p style="margin: 0 0 8px 0; font-size: 13px; color: #666;">
                        <span style="font-weight: 600; color: #1a1a1a;">Foundry</span><span style="font-weight: 600; color: #0066ff;">AI</span> • Building the Future
                      </p>
                      <p style="margin: 0; font-size: 12px; color: #999;">
                        © ${new Date().getFullYear()} FoundryAI • Bangalore, India
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
          
          <!--[if mso]>
          </td>
          </tr>
          </table>
          <![endif]-->
          
        </div>
      </td>
    </tr>
  </table>

</body>
</html>
  `;
};

module.exports = { generateEmailTemplate };
