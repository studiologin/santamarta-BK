import { EditPageClient } from "./client-page";

export async function generateStaticParams() {
    return [
        { slug: 'sobre' },
        { slug: 'servicos' },
        { slug: 'construcao-civil' },
        { slug: 'geossinteticos' },
        { slug: 'contato' }
    ];
}

export default async function EditPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return <EditPageClient slug={slug} />;
}
