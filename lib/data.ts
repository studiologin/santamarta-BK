
export const companyInfo = {
  name: "Santa Marta",
  phone: "(71) 98720-3123",
  email: "vendas@santamartageo.com.br",
  address: "Salvador, BA", // Placeholder
  workingHours: "Seg a Sex - 08h às 17h",
  whatsappLink: "https://wa.me/5571987203123", // Example link
  socials: {
    instagram: "#",
    linkedin: "#",
    facebook: "#"
  },
  footerText: "Somos uma empresa especializada em soluções de geossintéticos, construção civil e serviços relacionados. Com anos de experiência no mercado, oferecemos produtos de alta qualidade e serviços personalizados para atender às necessidades de nossos clientes. Nosso compromisso é com a inovação, sustentabilidade e excelência em cada projeto."
};

export const stats = [
  { label: "Anos de Experiência", value: "15+" },
  { label: "Projetos Executados", value: "500+" },
  { label: "Clientes Satisfeitos", value: "300+" },
  { label: "Produtos em Catálogo", value: "100+" },
];

export const faqs = [
  {
    question: "Vocês realizam instalação dos produtos?",
    answer: "Sim, oferecemos serviços completos de instalação com equipe especializada para garantir a melhor performance dos geossintéticos e materiais de construção."
  },
  {
    question: "Atendem em quais regiões?",
    answer: "Atuamos em todo o estado da Bahia e regiões vizinhas. Entre em contato para verificar a disponibilidade para sua localidade."
  },
  {
    question: "Fornecem consultoria técnica?",
    answer: "Sim, nossa equipe de engenharia oferece consultoria completa para auxiliar na escolha e aplicação correta dos materiais para sua obra."
  },
  {
    question: "Qual o prazo médio de entrega?",
    answer: "O prazo varia de acordo com o produto e a quantidade. Mantemos estoque dos principais itens para atendimento imediato."
  }
];

export const services = [
  {
    id: "instalacao",
    slug: "instalacao",
    title: "Instalação Técnica",
    description: "Execução especializada de instalação de geossintéticos e proteções coletivas.",
    fullDescription: "Nossa equipe de instalação é altamente treinada e certificada para garantir que todos os materiais sejam aplicados conforme as normas técnicas vigentes. Utilizamos equipamentos de ponta para assegurar a integridade e a longevidade das obras, seja na aplicação de geomembranas, geogrelhas ou sistemas de proteção coletiva.",
    image: "/images/products/technical_installation_service_workers_pond_liner_1772753090312.png"
  },
  {
    id: "projetos",
    slug: "projetos",
    title: "Projetos de Engenharia",
    description: "Desenvolvimento de projetos personalizados para obras de infraestrutura e geotecnia.",
    fullDescription: "Elaboramos projetos detalhados para obras que utilizam geossintéticos, focando em eficiência, economia e segurança. Nossos engenheiros analisam as condições do solo e as necessidades específicas de cada cliente para entregar soluções sob medida.",
    image: "/images/products/engineering_consultancy_professional_construction_office_plans_site_visit_1772753110437.png"
  },
  {
    id: "consultoria",
    slug: "consultoria",
    title: "Consultoria em Segurança",
    description: "Assessoria completa em segurança do trabalho e normas regulamentadoras.",
    fullDescription: "Oferecemos consultoria especializada para adequação de obras às normas de segurança do trabalho, com foco em proteções coletivas e prevenção de acidentes. Realizamos diagnósticos, treinamentos e acompanhamento técnico.",
    image: "/images/products/geosynthetics_hero_1772752854099.png"
  }
];

export const products = [
  // Geossintéticos
  {
    id: "manta-geotextil",
    slug: "manta-geotextil",
    name: "Manta Geotêxtil",
    category: "geossinteticos",
    description: "Manta não-tecida para filtração, separação e proteção.",
    fullDescription: "O geotêxtil não-tecido é desenvolvido para atender diversas aplicações na engenharia civil e ambiental. Suas principais funções são filtração, separação, drenagem e proteção. É amplamente utilizado em obras viárias, aterros, muros de contenção e sistemas de drenagem.",
    image: "/images/products/geotextile_manta_1772752884433.png",
    related: ["tubo-dreno", "geogrelha"]
  },
  {
    id: "geomembrana",
    slug: "geomembrana",
    name: "Geomembrana PEAD",
    category: "geossinteticos",
    description: "Impermeabilização de alta performance para obras ambientais.",
    fullDescription: "A geomembrana de PEAD (Polietileno de Alta Densidade) oferece excelente resistência química e mecânica, sendo ideal para impermeabilização de aterros sanitários, lagoas de tratamento, reservatórios de água e canais de irrigação.",
    image: "/images/products/geomembrane_pead_detail_1772752899829.png",
    related: ["manta-geotextil", "geocelula"]
  },
  {
    id: "tubo-dreno",
    slug: "tubo-dreno",
    name: "Tubo Dreno",
    category: "geossinteticos",
    description: "Tubos corrugados para drenagem subterrânea.",
    fullDescription: "Tubos dreno corrugados flexíveis, fabricados em PEAD, destinados a captar e escoar o excesso de água no solo, protegendo obras de engenharia contra a ação nociva da água.",
    image: "/images/products/drain_pipe_corrugated_1772752927399.png",
    related: ["manta-geotextil", "biomanta"]
  },
  {
    id: "geogrelha",
    slug: "geogrelha",
    name: "Geogrelha",
    category: "geossinteticos",
    description: "Reforço de solos e pavimentos.",
    fullDescription: "Geogrelhas são elementos estruturais utilizados para reforço de solos, permitindo a construção de muros de contenção, taludes íngremes e estabilização de solos moles.",
    image: "/images/products/geogrid_stabilization_1772752946216.png",
    related: ["manta-geotextil", "geocelula"]
  },
  {
    id: "geocelula",
    slug: "geocelula",
    name: "Geocélula",
    category: "geossinteticos",
    description: "Confinamento celular para controle de erosão.",
    fullDescription: "Sistema de confinamento celular tridimensional que melhora as características estruturais e funcionais dos solos e materiais de preenchimento.",
    image: "/images/products/geocell_erosion_control_detail_1772752968157.png",
    related: ["biomanta", "geogrelha"]
  },
  {
    id: "biomanta",
    slug: "biomanta",
    name: "Biomanta",
    category: "geossinteticos",
    description: "Proteção superficial contra erosão.",
    fullDescription: "Mantas biodegradáveis constituídas de fibras vegetais, utilizadas para proteção imediata do solo contra processos erosivos e para auxiliar no estabelecimento da vegetação.",
    image: "/images/products/biomanta_vegetation_detail_closeup_1772752990367.png",
    related: ["geocelula", "tubo-dreno"]
  },
  {
    id: "geocomposto-drenante",
    slug: "geocomposto-drenante",
    name: "Geocomposto Drenante",
    category: "geossinteticos",
    description: "Alternativa eficiente para drenagens tradicionais de brita e areia.",
    fullDescription: "O geocomposto drenante é formado por um núcleo drenante envolto por geotêxtil, substituindo com eficiência e economia os sistemas tradicionais de drenagem com brita e areia.",
    image: "/images/products/drainage_composite_detail_layer_1772753005369.png",
    related: ["tubo-dreno", "manta-geotextil"]
  },
  {
    id: "gcl-bentonitico",
    slug: "gcl-bentonitico",
    name: "GCL - Bentonítico",
    category: "geossinteticos",
    description: "Barreira hidráulica composta de bentonita de sódio autovedante.",
    fullDescription: "O GCL (Geosynthetic Clay Liner) é um geocomposto bentonítico que atua como barreira hidráulica de alta performance, substituindo camadas de argila compactada em obras ambientais.",
    image: "/images/products/bentonite_gcl_liner_roll_detail_1772753020013.png",
    related: ["geomembrana", "manta-geotextil"]
  },

  // Construção Civil
  {
    id: "tela-fachadeiro",
    slug: "tela-fachadeiro",
    name: "Tela Fachadeiro",
    category: "construcao-civil",
    subcategory: "Proteções Coletivas",
    description: "Proteção para fachadas de edifícios em construção.",
    fullDescription: "Tela tecida em monofilamento de PEAD, utilizada para proteção de fachadas, evitando a queda de reboco, ferramentas e detritos sobre pedestres e veículos.",
    image: "/images/products/facade_mesh_protection_building_exterior_1772753034292.png",
    related: ["rede-protecao", "protecao-periferia"]
  },
  {
    id: "rede-protecao",
    slug: "rede-protecao",
    name: "Rede de Proteção",
    category: "construcao-civil",
    subcategory: "Proteções Coletivas",
    description: "Segurança contra quedas em altura.",
    fullDescription: "Redes de proteção tipo trapézio ou forca, essenciais para a segurança dos trabalhadores em obras verticais.",
    image: "/images/products/safety_net_construction_h_view_top_angle_1772753048463.png",
    related: ["tela-fachadeiro", "linha-vida"]
  },
  {
    id: "protecao-periferia",
    slug: "protecao-periferia",
    name: "Proteção de Periferia",
    category: "construcao-civil",
    subcategory: "Proteções Coletivas",
    description: "Sistemas modulares de guarda-corpo.",
    fullDescription: "Sistemas de proteção periférica (guarda-corpo) para bordas de lajes, escadas e poços de elevador, garantindo a segurança coletiva contra quedas.",
    image: "/images/products/edge_protection_guardrail_system_roof_edge_1772753062311.png",
    related: ["rede-protecao", "linha-vida"]
  },
  {
    id: "linha-vida",
    slug: "linha-vida",
    name: "Linha de Vida",
    category: "construcao-civil",
    subcategory: "Geral",
    description: "Sistemas de ancoragem para segurança.",
    fullDescription: "Sistemas de linha de vida horizontal e vertical, fixos ou temporários, para ancoragem de cintos de segurança em trabalhos em altura.",
    image: "/images/products/lifeline_anchorage_system_safety_worker_high_rise_1772753076458.png",
    related: ["rede-protecao", "protecao-periferia"]
  },
  {
    id: "tag-identificacao",
    slug: "tag-identificacao",
    name: "TAG de Identificação",
    category: "construcao-civil",
    subcategory: "Gerais",
    description: "Sinalização e controle de acesso.",
    fullDescription: "Tags personalizadas para identificação de funcionários, visitantes e equipamentos na obra.",
    image: "/images/products/tag_identification_site_safety_visitor_badges_id_card_holder_closeup_view_1772753125729.png",
    related: ["funil-obras", "abracadeiras"]
  },
  {
    id: "funil-obras",
    slug: "funil-obras",
    name: "Funil para Obras",
    category: "construcao-civil",
    subcategory: "Gerais",
    description: "Dutos para coleta de entulho.",
    fullDescription: "Sistema de dutos condutores de entulho, práticos e resistentes, para remoção de resíduos em obras verticais.",
    image: "https://picsum.photos/seed/funnel/800/600",
    related: ["tag-identificacao", "abracadeiras"]
  },
  {
    id: "abracadeiras",
    slug: "abracadeiras",
    name: "Abraçadeiras",
    category: "construcao-civil",
    subcategory: "Gerais",
    description: "Fixação e organização.",
    fullDescription: "Abraçadeiras de nylon e metálicas para diversas aplicações de fixação e organização no canteiro de obras.",
    image: "/images/products/nylon_zip_ties_fasteners_industrial_pack_close_up_black_white_mix_color_1772753140000.png",
    related: ["tag-identificacao", "funil-obras"]
  }
];
