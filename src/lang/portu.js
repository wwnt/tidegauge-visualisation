//自定义英语翻译文件
//Custom English translation files
import pt from 'vuetify/es5/locale/pt';

export default {
  ...pt, //继承 Vuetify 的翻译 Inherit Vuetify's translation

  //添加自己的翻译 Add your own translation
  login:{
    authorizationTitle:'Valorizamos a sua privacidade',
    authorizationInfo:'Ao clicar em “Aceitar todos os cookies”, concorda com o armazenamento de cookies no seu dispositivo para autenticação do utilizador e dados em tempo real.',
    agree:'Aceite todos os cookies'
  },
  systemName: 'Sistema de gestão de estações maregráficas',
  datetimePicker: {
    date: 'data',
    time: 'tempo',
    cancel: 'Cancelar',
    confirm: 'confirmar',
    start_error: 'Selecione um horário de início',
    end_error: 'Selecione o horário de fim'
  },
  account:{
    username:'nome de utilizador',
    password:'senha',
    nameRules:'Por favor preencha o nome de utilizador',
    pwsRules:'Por favor preencha a palavra-passe',
    signIn:'Conecte-se',
    account:'conta',
    logout:'sair',
    editAccount:'Modificar conta',
    authFailed:'Falha na autenticação',
    editSuccess:'Modificação bem-sucedida',
    edit_error:'Falha na modificação',
    createSuccess:'Adicionado com sucesso',
    create_error:'Falha ao adicionar',
    accountSignUp:'Registo de usuário',
    delUser:'Apagar utilizador',
    deleteSuccess:'Apagar com sucesso',
    confirmDelUser:'Por favor confirme para eliminar este utilizador!',
    btn:{
      confirm:'confirmar',
      cancel:'Cancelar',
    }
  },
  menu: {
    stationList: 'exibição do site',
    stationDetail: 'Detalhes do site',
    historyData: 'registo histórico',
    vedioQuery: 'Consulta de monitorização',
    userManagement: 'Gestão de usuários',
    otherConfig: 'Outras configurações',
    thresholdConfig: 'Configuração de limite'
  },
  home:{
    messageCenter:'Central de mensagens',
    allReaded:'Todos lidos',
    confirmRead:'Confirmar leitura',
    showUnread:'Mostrar não lido',
    showAll:'Mostrar tudo',
    aboutUs:'sobre nós'
  },
  message:{
    time:'tempo',
    status:'estado',
    itemName:'Nome do dispositivo',
    thresholdExceeded:'limite excedido',
    nowValue:'O valor presente é ',
    authFailed:'Falha na autenticação'
  },
  stationList: {
    searchPlaceholder: 'Pesquisar por nome do site',
  },
  stationDetail: {
    form: {
      stationName: 'Nome do site',
      latlng: 'coordenada',
      location: 'Localização',
      partner: 'Parceiro (e-mail)',
      contact: 'Informações de contacto',
      deviceId: 'ID do dispositivo',
    },
    formValidate: ' não pode estar vazio',
    ip: 'Endereço IP',
    btn: {
      new: 'Novo',
      cancel: 'Cancelar',
      submit: 'enviar',
      del: 'excluir',
    },
    showItemData: {
      comboboxLabel: "Selecione os dados a apresentar",
      online: 'on-line',
      offline: "Off-line",
      noData: 'Ainda não há dados'
    },
    delConfirm: {
      text: 'Deseja eliminar este site?',
      title: 'Apagar site',
      text1:'Este site contém dados.',
      title1:'Por favor confirme para eliminar o site com dados',
      actions: {
        cancelText: 'Cancelar',
        confirmText: 'Claro'
      }
    },
    tips: {
      delFail: 'Falha na eliminação',
      delSuccess: 'Apagar com sucesso',
      newFail: 'Nova falha',
      editFail: 'Falha na edição',
      saveSuccess: 'Salvo com sucesso',
      authFail: 'Falha na autenticação',
      noAuth: 'permissão negada',
      notAllowedDelete: 'O site contém dados e não pode ser eliminado.'
    }
  },
  historyData: {
    form: {
      stationName: 'Nome do site',
      cameraName: 'Câmera',
      dataType: 'tipo de dados',
      selectType:'Método de consulta',
      startTime: 'hora de início',
      endTime: 'hora de término',
      line: 'Gráfico de linhas',
      waterfall: 'gráfico em cascata',
    },
    btn: {
      query: 'Consulta',
      export: 'exportar csv',
    },
    dataType: {
      AirHumidity: 'humidade do ar',
      AirTemperature: 'temperatura do ar',
      WindDirection: 'direção do vento',
      WindSpeed: 'velocidade do vento',
      AirPressure: 'pressão atmosférica',
      Precipitation: 'Precipitation',
      WaterTemperature: 'temperatura da água',
      WaterSalinity: 'salinidade',
      WaterHeight: 'altura da superfície da água',
      Visibility: 'visibilidade',
      air_pressure:'pressão atmosférica',
      air_temperature:'temperatura do ar',
      air_humidity:'humidade do ar',
      wind_direction:'direção do vento',
      rain_gauge:'chuva',
      wind_speed:'velocidade do vento',
      water_level:'altura da superfície da água',
      water_distance:'Distância da superfície da água',
      water_salinity:'salinidade',
      water_temperature:'temperatura da água',
      water_total_dissolved_solids:'total de sólidos dissolvidos em água',
      water_conductivity:'condutividade da água',
      air_visibility:'visibilidade',
      // air_temperature:''
      precipitation_detection: 'Detecção de precipitação',
      rain_intensity: 'intensidade da chuva'

    },
    noData: 'Ainda não há dados',
    timeError: 'Por favor, preencha a hora correta',
    stationNameRequire: 'Por favor, selecione um nome de site',
    cameraNameRequire:'Selecione uma câmara',
    typeRequire: 'Por favor, selecione o tipo de dados',
  },
  otherConfig: {
    tabs: {
      tab1: 'sensor',
      tab2: 'Fonte de dados',
    },
    modify: 'modificar',
    delete: 'apagar',
  },
  sensorConfig: {
    search: 'pesquisar',
    modify: 'modificar',
    delete: 'apagar',
    formTitleNew: 'Novo registo do sensor',
    formTitleUpdate: 'Modificar registo do sensor',    
    form: {
      deviceId: 'ID do dispositivo',
      sensorName: 'nome do sensor',
      lastMaintenanceTime: 'Hora da última manutenção',
      textReason: 'Descrição'
    },
    btn: {
      cancel: 'cancelar',
      submit: 'Guardar',
      newBtnName: 'Novo'
    },
    table: {
      operation: 'operação',
      createdTime: 'Hora de criação',
      updatedTime: 'hora da modificação',
    },
    timeValidate: 'O tempo não pode estar vazio',
    tips: {
      saveSuccess: 'Guardar com sucesso',
      saveFail: 'Falha ao guardar',
    },
    charactersRestrictions: 'Não mais de 1000 caracteres',
    formValidate: ' não pode estar vazio',
  },
  dataSource:{
    test:'teste',
    save:'salvar',
    check:'verificação',
    sync:'sincronizar',
    camera:'câmara',
    data_history:'Dados históricos',
    username:'nome de utilizador',
    password:'password',
    operation:'operação',
    editConfig:'Modificar configuração',
    addConfig:'Nova configuração',
    del:'Apagar fonte de dados',
    confirmDeluser:'Por favor, confirme para eliminar esta fonte de dados!',
    upstreamUrl: 'caminho upstream'
  },
  userconfig: {
    tabs: {
      tab1: 'Gestão de conta',
      tab2: 'Aplicação de conta',
      tab3: 'Aplicação de permissão',
    },
    title: 'Gestão de utilizadores',
    create: 'Novo',
    check: 'Permissão de visualização',
    edit: 'Modificar permissões',
    delete: 'apagar',
    close: 'fechar',
    user: 'utilizador',
    superAdmin: 'Super Administrador',
    admin: 'Administrador',
    cancel: 'cancelar',
    save: 'confirmar',
    create_user: 'Novo utilizador',
    edit_user: 'Modificar utilizador',
    resetPws: 'Redefinir palavra-passe',
    username: 'nome de utilizador',
    mail: 'Caixa de correio',
    mailRequire: 'Por favor preencha o seu e-mail',
    mailValid: 'Erro no formato da caixa de correio',
    group: 'grupo',
    groupRules: 'Por favor, selecione um grupo',
    password: 'password',
    data_permission: 'permissão de dados',
    data: 'dados',
    editSuccess:'Modificação bem sucedida',
    editFailed:'Falha na edição',
    operation: 'operação',
    noPermission:'Sem permissão ainda',
    confirmPassword:'Confirmar palavra-passe',
    confirmPasswordRules:"Duas palavras-passe são inconsistentes.",
    applicationFailed:'Aplicação falhou',
    applicationSuccess:'A inscrição foi bem-sucedida, o resultado será notificado por e-mail',
    cameraPermissions: 'Permissões da câmara',
    snapshotPermissions: 'Permissões de instantâneo em tempo real'

  },
  accountRequest:{
    agree:'concordo',
    markAllAgree:'concordo marca',
    refuse:'recusar',
    markAllRefuse:'Rejeitar marca',
    agreeSuccess:'Concordo com sucesso',
    agreeFiled:'Falha na concordância',
    refuseSuccess:'Rejeitar sucesso',
    refuseFiled:'Falha na recusa',
    refuseUserApply:'Rejeitar aplicação do utilizador',
    registrationCode:'Código de registo',
    confirmRefuseUserApply:'Por favor, confirme para rejeitar esta subscrição de utilizador!'
  },
  thresholdConfig: {
    newBtn: 'Novo',
    search: 'pesquisar',
    modify: 'modificar',
    delete: 'apagar',
    formTitleNew: 'Novo limite',
    formTitleUpdate: 'Modificar limite',
    form: {
      stationName: 'nome da estação',
      sensorName: 'nome do sensor',
      itemName: 'tipo de dados',
      minVal: 'valor mínimo',
      maxVal: 'valor máximo'
    },
    isActive: 'Se ativar',
    btn: {
      cancel: 'cancelar',
      submit: 'Guardar',
    },
    table: {
      threshold: 'limiar',
      operation: 'operação',
    },
    formValidate: ' não pode estar vazio',
  },
  showData: {
    signOutBtn: 'Sair',
    overlayer: {
      title: 'Capa',
      data: 'exibição do site',
      threedHeight: 'Altura tridimensional do oceano',
      mapSeaHeight: 'Mapa da altura do oceano',
      seaHeightPhoto: 'Ilustração do nível do mar',
    },
    settingDialog: {
      title: 'Definições de reprodução',
      realTimeDataSetting:'Configuração de dados do site',
      selectStation:'Selecionar site',
      showStation:'site do COI',
      glossStation: 'site GLOSS',
      unit: 'segundo',
      cancelBtn: 'Cancelar',
      saveBtn: 'guardar',
      secondsValue: 'valor de segundos',
      formValidate: ' não pode estar vazio',
      positiveNumber: 'Deve ser um número positivo',
      saveError: 'Falha ao guardar! Por favor, defina os parâmetros de reprodução corretamente'
    },
    mapSeaHeight: {
      playBtn: 'jogar',
      pauseBtn: 'parar',
      information: 'Os dados actualmente apresentados são dados ADT oceânicos medidos por satélite. Os dados são renderizados com uma precisão de 1/8, considerando os dados de janeiro do ano inicial.'
    },
    glossDataTooltip:{
      dateUpdatedFaster: 'Comparado com a data de atualização da fonte de dados, os dados são atualizados mais rapidamente do que a estação',
      dateUpdatedSlower: 'Comparado com a data de atualização da fonte de dados, o site de atualização de dados é mais lento'
    },
    screenGuide:{
      first: 'Bem-vindo ao sistema de visualização em ecrã grande',
      second: 'Definir a ordem e a duração dos modelos de visualização',
      third: 'Selecione o tipo de site de visualização',
      forth:'Sair do grande ecrã',
      selectStationDatas: 'Selecione a estação a reproduzir',
      stationLegend: 'Referência da legenda do site',
      playCustomStation: 'Apresentar os dados da nossa própria estação',
      nextBtn: 'Seguinte',
      upBtn: 'Etapa anterior',
      finishBtn: 'concluído',
      isShowNavigationTitle:'Se apresentar a navegação da página',
      isShowNavigationText:'Clique em "Confirmar" e a navegação da página será novamente apresentada, caso contrário clique em "Cancelar"',
      confirmBtn:'confirmar',
      cancelBtn:'Cancelar'
    },
    stationsInfo:{
      introduction: 'Existem actualmente 290 estações GLOSS, das quais 285 são estações válidas. O número de dados históricos do nível do mar provenientes de diferentes fontes de dados nestas estações é aproximadamente: PSMSL, 308.000; O registo mais antigo que pode ser encontrado atualmente provém da estação GLOSS em França, em janeiro de 1846, e a estação ainda possui atualizações de dados.'
    },
    sonelLegends: {
      workBest: 'O site está a funcionar normalmente: os dados estão disponíveis',
      workBetter: 'O site detetou um problema, mas os dados estão disponíveis',
      workBad: "Este site não está a funcionar",
      noExits: 'Este site não existe',
      fromCountry: 'Este site não é gerido pela França'
    },
    photo: {
      seaLevel: 'Nível global do mar',
      playBtn: 'jogar',
      pauseBtn: 'pausa',
      viewReport: 'Ver relatório'
    }
  },
  video:{
    realTime:'consulta em tempo real',
    connect_error:'Falha na aquisição de dados, exceção de ligação da câmara',
    show9images:'Consultar as últimas 9 imagens'
  }
};
