export const STATES = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
];

export const CITIES_BY_STATE = {
  'SP': [
    'São Paulo', 'Guarulhos', 'Campinas', 'São Bernardo do Campo', 'Santo André',
    'Osasco', 'Ribeirão Preto', 'Sorocaba', 'Santos', 'Mauá', 'São José dos Campos',
    'Mogi das Cruzes', 'Diadema', 'Jundiaí', 'Carapicuíba', 'Piracicaba',
    'Bauru', 'São Vicente', 'Franca', 'Guarujá', 'Taubaté', 'Praia Grande',
    'Limeira', 'Suzano', 'Taboão da Serra', 'Sumaré', 'Barueri', 'Embu das Artes',
    'São Carlos', 'Marília', 'Indaiatuba', 'Cotia', 'Americana', 'Jacareí',
    'Araraquara', 'Presidente Prudente', 'Rio Claro', 'Araçatuba', 'Santa Bárbara d\'Oeste'
  ],
  'RJ': [
    'Rio de Janeiro', 'São Gonçalo', 'Duque de Caxias', 'Nova Iguaçu', 'Niterói',
    'Belford Roxo', 'São João de Meriti', 'Campos dos Goytacazes', 'Petrópolis',
    'Volta Redonda', 'Magé', 'Macaé', 'Itaboraí', 'Cabo Frio', 'Angra dos Reis',
    'Nova Friburgo', 'Barra Mansa', 'Teresópolis', 'Mesquita', 'Nilópolis'
  ],
  'MG': [
    'Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim',
    'Montes Claros', 'Ribeirão das Neves', 'Uberaba', 'Governador Valadares',
    'Ipatinga', 'Sete Lagoas', 'Divinópolis', 'Santa Luzia', 'Ibirité',
    'Poços de Caldas', 'Patos de Minas', 'Pouso Alegre', 'Teófilo Otoni',
    'Barbacena', 'Sabará', 'Vespasiano', 'Conselheiro Lafaiete', 'Varginha'
  ],
  'RS': [
    'Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria',
    'Gravataí', 'Viamão', 'Novo Hamburgo', 'São Leopoldo', 'Rio Grande',
    'Alvorada', 'Passo Fundo', 'Sapucaia do Sul', 'Uruguaiana', 'Santa Cruz do Sul',
    'Cachoeirinha', 'Bagé', 'Bento Gonçalves', 'Erechim', 'Guaíba'
  ],
  'PR': [
    'Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel',
    'São José dos Pinhais', 'Foz do Iguaçu', 'Colombo', 'Guarapuava',
    'Paranaguá', 'Araucária', 'Toledo', 'Apucarana', 'Pinhais',
    'Campo Largo', 'Arapongas', 'Almirante Tamandaré', 'Umuarama',
    'Paranavaí', 'Sarandi', 'Fazenda Rio Grande', 'Cambé', 'Francisco Beltrão'
  ],
  'SC': [
    'Florianópolis', 'Joinville', 'Blumenau', 'São José', 'Criciúma',
    'Chapecó', 'Itajaí', 'Lages', 'Jaraguá do Sul', 'Palhoça',
    'Balneário Camboriú', 'Brusque', 'Tubarão', 'São Bento do Sul',
    'Caçador', 'Camboriú', 'Navegantes', 'Concórdia', 'Rio do Sul', 'Araranguá'
  ],
  'BA': [
    'Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari',
    'Itabuna', 'Juazeiro', 'Lauro de Freitas', 'Ilhéus', 'Jequié',
    'Teixeira de Freitas', 'Alagoinhas', 'Porto Seguro', 'Simões Filho',
    'Paulo Afonso', 'Eunápolis', 'Candeias', 'Guanambi', 'Jacobina',
    'Serrinha', 'Senhor do Bonfim', 'Dias d\'Ávila', 'Luís Eduardo Magalhães'
  ],
  'GO': [
    'Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Luziânia',
    'Águas Lindas de Goiás', 'Valparaíso de Goiás', 'Trindade', 'Formosa',
    'Novo Gama', 'Itumbiara', 'Senador Canedo', 'Catalão', 'Jataí',
    'Planaltina', 'Caldas Novas', 'Santo Antônio do Descoberto', 'Goianésia'
  ],
  'PE': [
    'Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Petrolina',
    'Paulista', 'Cabo de Santo Agostinho', 'Camaragibe', 'Garanhuns',
    'Vitória de Santo Antão', 'Igarassu', 'São Lourenço da Mata',
    'Santa Cruz do Capibaribe', 'Abreu e Lima', 'Ipojuca', 'Serra Talhada',
    'Araripina', 'Gravatá', 'Carpina', 'Goiana'
  ],
  'CE': [
    'Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral',
    'Crato', 'Itapipoca', 'Maranguape', 'Iguatu', 'Quixadá',
    'Canindé', 'Aquiraz', 'Pacatuba', 'Crateús', 'Russas',
    'Aracati', 'Cascavel', 'Pacajus', 'Icó', 'Horizonte'
  ],
  'PA': [
    'Belém', 'Ananindeua', 'Santarém', 'Marabá', 'Parauapebas',
    'Castanhal', 'Abaetetuba', 'Cametá', 'Marituba', 'Bragança',
    'Altamira', 'Tucuruí', 'Benevides', 'Paragominas', 'Redenção',
    'Barcarena', 'Capanema', 'Tailândia', 'Oriximiná', 'Breves'
  ],
  'MA': [
    'São Luís', 'Imperatriz', 'São José de Ribamar', 'Timon', 'Caxias',
    'Codó', 'Paço do Lumiar', 'Açailândia', 'Bacabal', 'Balsas',
    'Santa Inês', 'Pinheiro', 'Pedreiras', 'Chapadinha', 'Santa Luzia',
    'Barra do Corda', 'Coelho Neto', 'Rosário', 'Presidente Dutra', 'Viana'
  ],
   'AC': [
    'Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira', 'Tarauacá', 'Feijó',
    'Brasiléia', 'Plácido de Castro', 'Xapuri', 'Senador Guiomard', 'Marechal Thaumaturgo'
  ],
  'AL': [
    'Maceió', 'Arapiraca', 'Rio Largo', 'Palmeira dos Índios', 'União dos Palmares',
    'Penedo', 'São Miguel dos Campos', 'Campo Alegre', 'Delmiro Gouveia', 'Coruripe'
  ],
  'AP': [
    'Macapá', 'Santana', 'Laranjal do Jari', 'Oiapoque', 'Porto Grande',
    'Mazagão', 'Tartarugalzinho', 'Pedra Branca do Amapari', 'Ferreira Gomes', 'Cutias'
  ],
  'AM': [
    'Manaus', 'Parintins', 'Itacoatiara', 'Manacapuru', 'Coari',
    'Tefé', 'Benjamin Constant', 'Tabatinga', 'Maués', 'Iranduba'
  ],
  'DF': [
    'Brasília', 'Ceilândia', 'Taguatinga', 'Samambaia', 'Planaltina',
    'Sobradinho', 'Gama', 'Recanto das Emas', 'Santa Maria', 'Guará'
  ],
  'ES': [
    'Vitória', 'Vila Velha', 'Serra', 'Cariacica', 'Cachoeiro de Itapemirim',
    'Linhares', 'Guarapari', 'Colatina', 'Aracruz', 'Viana'
  ],
  'MT': [
    'Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Tangará da Serra',
    'Cáceres', 'Primavera do Leste', 'Sorriso', 'Barra do Garças', 'Lucas do Rio Verde'
  ],
  'MS': [
    'Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá', 'Ponta Porã',
    'Naviraí', 'Nova Andradina', 'Paranaíba', 'Aquidauana', 'Sidrolândia'
  ],
  'PB': [
    'João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos', 'Bayeux',
    'Sousa', 'Cajazeiras', 'Guarabira', 'Cabedelo', 'Itabaiana'
  ],
  'PI': [
    'Teresina', 'Parnaíba', 'Picos', 'Piripiri', 'Floriano',
    'Campo Maior', 'Barras', 'União', 'José de Freitas', 'Altos'
  ],
  'RN': [
    'Natal', 'Mossoró', 'Parnamirim', 'São Gonçalo do Amarante', 'Macaíba',
    'Ceará-Mirim', 'Caicó', 'Assú', 'Currais Novos', 'Santa Cruz'
  ],
  'RO': [
    'Porto Velho', 'Ji-Paraná', 'Ariquemes', 'Vilhena', 'Cacoal',
    'Rolim de Moura', 'Guajará-Mirim', 'Pimenta Bueno', 'Jaru', 'Ouro Preto do Oeste'
  ],
  'RR': [
    'Boa Vista', 'Rorainópolis', 'Caracaraí', 'Cantá', 'Alto Alegre',
    'Pacaraima', 'Mucajaí', 'Amajari', 'Bonfim', 'Iracema'
  ],
  'SE': [
    'Aracaju', 'Nossa Senhora do Socorro', 'Lagarto', 'Itabaiana', 'Estância',
    'São Cristóvão', 'Itabaianinha', 'Tobias Barreto', 'Simão Dias', 'Propriá'
  ],
  'TO': [
    'Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional', 'Paraíso do Tocantins',
    'Colinas do Tocantins', 'Guaraí', 'Tocantinópolis', 'Dianópolis', 'Formoso do Araguaia'
  ]
};

export const PROFESSIONAL_CATEGORIES = [
  'Eletricista',
  'Encanador',
  'Pedreiro',
  'Pintor',
  'Marceneiro',
  'Cabeleireiro',
  'Manicure',
  'Esteticista',
  'Diarista',
  'Jardineiro',
  'Técnico em Informática',
  'Mecânico',
  'Professor Particular',
  'Massagista',
  'Personal Trainer',
  'Fotógrafo',
  'Advogado',
  'Contador',
  'Arquiteto',
  'Designer',
  'Outros'
];

