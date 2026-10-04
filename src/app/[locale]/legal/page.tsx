import type { Metadata } from "next";
import { brandLine, operator } from "@/content/brand";
import { storeIds, stores } from "@/content/stores";
import { PageHead } from "@/components/Sections";
import { localePath } from "@/lib/i18n";
import { pageMetadata, resolveLocale, type LocaleParams } from "@/lib/page";
import { isPreview, shown } from "@/lib/site";

const PATH = "/legal";

export async function generateMetadata({
  params,
}: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return pageMetadata(locale, PATH, t.legal.metaTitle, t.legal.pendingNotice);
}

/** Operator details — only confirmed data, never derived from the brand name. */
export default async function LegalPage({ params }: { params: LocaleParams }) {
  const { locale, t } = await resolveLocale(params);
  const data = shown(operator);
  const fields = ["legalName", "address", "registration", "contact"] as const;
  return (
    <>
      <PageHead
        title={t.legal.title}
        crumbLabel={t.common.breadcrumb}
        crumbs={[{ href: localePath(locale, "/"), label: t.common.home }]}
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container prose">
          {!data && <p className="notice">{t.legal.pendingNotice}</p>}
          {!data && !isPreview() ? (
            // Until the operator details follow: only confirmed contact data of the business.
            <>
              <h2 style={{ fontSize: "1.3rem" }}>{brandLine}</h2>
              <dl className="facts">
                {storeIds.map((id) => {
                  const address = shown(stores[id].address);
                  const phone = shown(stores[id].phone);
                  return (
                    <div key={id} style={{ display: "contents" }}>
                      <dt>{t.storeNames[id]}</dt>
                      <dd>
                        {address}
                        {phone && (
                          <>
                            <br />
                            <a href={`tel:${phone.replace(/\s/g, "")}`}>
                              {phone}
                            </a>
                          </>
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </>
          ) : (
            <dl className="facts">
              {fields.map((f) => (
                <div key={f} style={{ display: "contents" }}>
                  <dt>{t.legal.fields[f]}</dt>
                  <dd>
                    {data ? (
                      data[f]
                    ) : (
                      <span className="pending">{t.common.toBeConfirmed}</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>
    </>
  );
}
