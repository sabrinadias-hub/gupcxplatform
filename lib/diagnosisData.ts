export interface DiagnosisQuestion {
  id: string;
  text: string;
}

export interface DiagnosisAxis {
  id: string;
  name: string;
  questions: DiagnosisQuestion[];
}

export const DIAGNOSIS_AXES: DiagnosisAxis[] = [
  {
    id: 'socios',
    name: 'Sócios',
    questions: [
      { id: 'q1', text: 'Possui acordo de sócios ou quotistas formalmente estabelecido?' },
      { id: 'q2', text: 'Como são tomadas as decisões estratégicas entre os sócios?' },
      { id: 'q3', text: 'Existe clareza na divisão de responsabilidades e papéis de cada sócio?' },
      { id: 'q4', text: 'Como é feita a remuneração dos sócios (pró-labore, distribuição de lucros)?' },
      { id: 'q5', text: 'Há reuniões periódicas entre os sócios para alinhamento?' }
    ]
  },
  {
    id: 'financas',
    name: 'Finanças',
    questions: [
      { id: 'q1', text: 'Possui controle de fluxo de caixa atualizado?' },
      { id: 'q2', text: 'Como é feito o controle de contas a pagar e a receber?' },
      { id: 'q3', text: 'Tem clareza sobre a margem de contribuição de cada serviço/produto?' },
      { id: 'q4', text: 'Realiza conciliação bancária regularmente?' },
      { id: 'q5', text: 'Possui relatórios financeiros (DRE, Balanço) atualizados?' }
    ]
  },
  {
    id: 'folha',
    name: 'Folha',
    questions: [
      { id: 'q1', text: 'Como é feito o controle de ponto dos funcionários?' },
      { id: 'q2', text: 'Possui organização da documentação trabalhista (contratos, admissões, demissões)?' },
      { id: 'q3', text: 'Como são calculados e controlados os encargos trabalhistas?' },
      { id: 'q4', text: 'Tem clareza sobre o custo total de cada colaborador?' },
      { id: 'q5', text: 'Possui política clara de benefícios e remuneração?' }
    ]
  },
  {
    id: 'clientes',
    name: 'Clientes',
    questions: [
      { id: 'q1', text: 'Possui cadastro organizado de todos os clientes?' },
      { id: 'q2', text: 'Como é feito o acompanhamento do histórico de atendimento?' },
      { id: 'q3', text: 'Realiza pesquisas de satisfação regularmente?' },
      { id: 'q4', text: 'Tem processo definido para tratamento de reclamações?' },
      { id: 'q5', text: 'Como é feita a segmentação e análise do perfil dos clientes?' }
    ]
  },
  {
    id: 'vendas',
    name: 'Vendas',
    questions: [
      { id: 'q1', text: 'Possui funil de vendas estruturado?' },
      { id: 'q2', text: 'Como é feito o controle de propostas enviadas?' },
      { id: 'q3', text: 'Tem metas de vendas definidas por período?' },
      { id: 'q4', text: 'Como é feito o follow-up de oportunidades?' },
      { id: 'q5', text: 'Possui indicadores de performance de vendas (taxa de conversão, ticket médio)?' }
    ]
  },
  {
    id: 'ia_automacao',
    name: 'IA & Automação',
    questions: [
      { id: 'q1', text: 'Utiliza alguma ferramenta de automação de processos?' },
      { id: 'q2', text: 'Como é feita a comunicação com clientes (manual ou automatizada)?' },
      { id: 'q3', text: 'Possui integração entre os sistemas utilizados?' },
      { id: 'q4', text: 'Utiliza ou planeja utilizar IA em algum processo?' },
      { id: 'q5', text: 'Tem processos repetitivos que poderiam ser automatizados?' }
    ]
  },
  {
    id: 'reforma_tributaria',
    name: 'Reforma Tributária',
    questions: [
      { id: 'q1', text: 'Está acompanhando as mudanças da reforma tributária?' },
      { id: 'q2', text: 'Sabe como a reforma pode impactar seu negócio?' },
      { id: 'q3', text: 'Possui planejamento tributário estruturado?' },
      { id: 'q4', text: 'Tem assessoria especializada em questões tributárias?' },
      { id: 'q5', text: 'Realiza análise periódica de regime tributário (Simples, Lucro Presumido, Real)?' }
    ]
  },
  {
    id: 'estrategia',
    name: 'Estratégia',
    questions: [
      { id: 'q1', text: 'Possui planejamento estratégico formalizado?' },
      { id: 'q2', text: 'Tem metas e objetivos claros para os próximos 12 meses?' },
      { id: 'q3', text: 'Como é feito o acompanhamento das metas?' },
      { id: 'q4', text: 'Possui indicadores-chave de performance (KPIs) definidos?' },
      { id: 'q5', text: 'Realiza análise de concorrência e mercado regularmente?' }
    ]
  }
];

export const getMaturityLevel = (score: number): 'red' | 'yellow' | 'blue' | 'green' => {
  if (score < 2) return 'red';
  if (score < 3) return 'yellow';
  if (score < 4) return 'blue';
  return 'green';
};
