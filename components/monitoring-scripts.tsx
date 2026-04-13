import { createClient } from "@/utils/supabase/server";
import Script from "next/script";

export async function MonitoringScripts() {
    // We use a try-catch to prevent build errors if the table/database is not reachable during build
    try {
        const supabase = await createClient();
        const { data } = await supabase
            .from("site_settings")
            .select("value")
            .eq("key", "monitoring")
            .maybeSingle();

        if (!data || !data.value) return null;

        const {
            google_analytics_id,
            facebook_pixel_id,
            google_tag_manager_id,
            header_scripts,
            body_scripts
        } = data.value;

        return (
            <>
                {/* Google Analytics */}
                {google_analytics_id && (
                    <>
                        <Script
                            src={`https://www.googletagmanager.com/gtag/js?id=${google_analytics_id}`}
                            strategy="afterInteractive"
                        />
                        <Script id="google-analytics" strategy="afterInteractive">
                            {`
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${google_analytics_id}');
                            `}
                        </Script>
                    </>
                )}

                {/* Google Tag Manager - Header Part */}
                {google_tag_manager_id && (
                    <Script id="gtm" strategy="afterInteractive">
                        {`
                            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                            })(window,document,'script','dataLayer','${google_tag_manager_id}');
                        `}
                    </Script>
                )}

                {/* Facebook Pixel */}
                {facebook_pixel_id && (
                    <Script id="facebook-pixel" strategy="afterInteractive">
                        {`
                            !function(f,b,e,v,n,t,s)
                            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                            n.queue=[];t=b.createElement(e);t.async=!0;
                            t.src=v;s=b.getElementsByTagName(e)[0];
                            s.parentNode.insertBefore(t,s)}(window, document,'script',
                            'https://connect.facebook.net/en_US/fbevents.js');
                            fbq('init', '${facebook_pixel_id}');
                            fbq('track', 'PageView');
                        `}
                    </Script>
                )}

                {/* Custom Header Scripts */}
                {header_scripts && (
                    <div
                        style={{ display: 'none' }}
                        dangerouslySetInnerHTML={{ __html: header_scripts }}
                    />
                )}

                {/* Custom Body Scripts */}
                {body_scripts && (
                    <div
                        style={{ display: 'none' }}
                        dangerouslySetInnerHTML={{ __html: body_scripts }}
                    />
                )}
            </>
        );
    } catch (e) {
        console.error("Error loading monitoring scripts:", e);
        return null;
    }
}
