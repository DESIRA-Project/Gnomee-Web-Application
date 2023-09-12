export const environment = {
  production: true,
  env: {
    client:{
      prefix:"/kbt/"
    },
    backend: {
      protocol: "https",
      host: "",
      port: "",
      recaptcha_key: "",
      use_analytics: false,
      use_recaptcha: true,
      use_goauth: true,
      backend_prefix:"kbtbe/",
      get_tool_data_service: "kbtbe/indexedtools/getTools",
      browse_tools_path_service: "kbtbe/indexedtools/browseToolPaths",
      browse_tools_service: "kbtbe/indexedtools/getBrowsedTools",
      search_term_data_service: "kbtbe/indexedtools/searchTerm",
      get_tool_details: "kbtbe/indexedtools/getTool",
      contact_service: "kbtbe/communication/contact",
      technology_usage_service: "kbtbe/visuals/getMostUsedTechnologies",
      country_tools_service: "kbtbe/visuals/getToolsPerCountry",
      get_country_tools: "kbtbe/visuals/getToolsUsedInCountry",
      data_counters_service: "kbtbe/visuals/getDataCounters",
      get_human_tool_interactions_service: "kbtbe/visuals/getToolsPerHumanInteraction",
      get_popular_keywords_service: "kbtbe/visuals/getKeywordsCount",
      analytics_get_filter_indices_usage: 'kbtbe/analytics/getFilterIndicesUsage',
      analytics_get_filter_value_frequency: 'kbtbe/analytics/getFilterValueFrequency',
      analytics_get_search_terms: 'kbtbe/analytics/getSearchTerms',
      analytics_get_tool_visits: 'kbtbe/analytics/getToolVisits',
      analytics_get_browsed_app_scenarios: 'kbtbe/analytics/getBrowsedAppScenarios',
      analytics_get_browsed_filter_path: 'kbtbe/analytics/getBrowsedFilterPath',
      analytics_get_most_popular_value_in_filters: 'kbtbe/analytics/getMostPopularValueInFilters',
      analytics_get_visitor_countries: 'kbtbe/analytics/getVisitorCountries',
      get_tool_suggestion_data: "kbtbe/authuseractions/getToolSuggestionDataForm",
      get_digital_tool: "kbtbe/authuseractions/getDigitalTool",
      update_digital_tool: "kbtbe/authuseractions/updateDigitalTool",
      get_suggested_digital_tools: "kbtbe/authuseractions/getSuggestedDigitalTools",
      delete_suggested_digital_tool: "kbtbe/authuseractions/deleteSuggestedDigitalTool",
      delete_stored_digital_tool: "kbtbe/authuseractions/deleteStoredDigitalTool",
      suggest_digital_tool: "kbtbe/authuseractions/suggestDigitalTool",
      get_suggested_tool: "kbtbe/authuseractions/getSuggestedTool",
      update_digital_tool_suggestion: "kbtbe/authuseractions/updateDigitalToolSuggestion",
      get_all_suggested_digital_tools: "kbtbe/authuseractions/getAllSuggestedDigitalTools",
      commit_suggested_tool: "kbtbe/authuseractions/commitSuggestedDigitalTool",
      get_user_profile: "kbtbe/authuseractions/getUserProfile",
      request_user_profile: "kbtbe/authuseractions/requestUserProfile",
      request_update_user_profile: "kbtbe/authuseractions/requestUpdateUserProfile",
      request_user_activation: "kbtbe/authuseractions/requestUserActivation",
      update_user_profile: "kbtbe/authuseractions/updateUserProfile",
      get_users: "kbtbe/authuseractions/getUsers",
      gooath: "kbtbe/auth/googlesignin",
      get_auth_providers: "kbtbe/auth/getSupportedAuthProviders",
      digital_tool_management_get_tools:'kbtbe/authuseractions/getToolsSimpleView',
      analytics_get_tool_relation_graph: 'kbtbe/analytics/getToolRelationGraph',
      get_user_background_options: "kbtbe/user-background/getUserBackgroundOptions",
      register_user_background_selection: "kbtbe/user-background/registerUserBackgroundSelection",
      dt_url_click:"kbtbe/analytics/dtUrlClick",
      user_client_is_known : "kbtbe/user-background/userClientIsKnown",
      analytics_get_top_k_search_terms: "kbtbe/analytics/getTopKSearchTerms"
    },
    goauth: {
      async: true,
      src: "https://apis.google.com/js/api.js",
      defer: true,
      img: "assets/btn_google_signin_light_normal_web.png",
      img_width:191,
      img_height:46,
      client_id:''
    },
    userFeedbackModal:{use:true,name:"kbt_user_feedback_modal",defaultCookieSkipIntervalDays:1,text:"What is your background?",title:"Your input is valuable"},
    oaoauth: {
      async: true,
      src: "https://apis.google.com/js/api.js",
      defer: true,
      img: "assets/openaire.png",
      img_width:100,
      img_height:70,
      login_url:"",
      redirect_url:"",
      client_id:"",
      scope:"openid profile email",
      response_type:"code"

  },
    ga: {
      global_site_tag: [
        {
          code: "window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());        gtag('config', '');"
        },
        {
          async: true,
          src: "https://www.googletagmanager.com/gtag/js?id="
        }
      ],
      header: "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','');",
      body: "<iframe src=\"https://www.googletagmanager.com/ns.html?id=\" height=\"0\" width=\"0\" style=\"display:none;visibility:hidden\"></iframe>"
    },
    user_landing_page: {
      views: [
        { name: "userHomePage", desc: "Home", scope: "General", url: "/home", breadcrumb_label: "Home", permissions: ["create_tool_suggestion"],icon:"fa-home",uses_recaptcha:false },
        { name: "editUserProfile", desc: "My Profile", scope: "General", url: "/my-profile", breadcrumb_label: "My Profile", permissions: ["edit_profile"],icon:"fa-user",uses_recaptcha:false },
        { name: "toolSuggestion", desc: "Digital Tool Suggestion", scope: "General", url: "/digital-tool-suggestion", breadcrumb_label: "Digital Tool Suggestion", permissions: ["create_tool_suggestion"],icon:"fa-comment",uses_recaptcha:true },
        { name: "showUserToolSuggestions", desc: "My Suggestions", scope: "General", url: "/my-suggestions", breadcrumb_label: "My Suggestions", permissions: ["view_my_suggested_tools", "update_my_suggested_tools"],icon:"fa-comments",uses_recaptcha:false },
        { name: "viewAllSuggestedTools", desc: "Moderate Suggestions", scope: "ADMINISTRATION", url: "/moderate-suggestions", breadcrumb_label: "Moderate Suggestions", breadcrumb_path: [{ name: "Home", key: "home" }, { name: "Administration", key: "" }, { name: "Moderate Suggestions", key: "" }], permissions: ["edit_suggested_tools", "insert_suggested_tool"],icon:"fa-edit",uses_recaptcha:false },
        { name: "usersManagement", desc: "Users Management", scope: "ADMINISTRATION", url: "/users-management", breadcrumb_label: "Users Management", breadcrumb_path: [{ name: "Home", key: "home" }, { name: "Administration", key: "" }, { name: "Users Management", key: "" }], permissions: ["view_all_users", "edit_all_users"],icon:"fa-users-cog" ,uses_recaptcha:false},
        { name: "dtManagement", desc: "Digital Tool Management", scope: "ADMINISTRATION", url: "/dt-management", breadcrumb_label: "Digital Tool Management", breadcrumb_path: [{ name: "Home", key: "home" }, { name: "Administration", key: "" }, { name: "Digital Tool Management", key: "" }], permissions: ["edit_stored_dts", "remove_stored_dts"],icon:"fa-thin fa-cube",uses_recaptcha:true } ,
        { name: "userAnalytics", desc: "Analytics", scope: "ADMINISTRATION", url: "/analytics", breadcrumb_label: "Analytics", permissions: ["view_user_analytics","view_all_analytics"],icon:"fa-thin fa-chart-line",uses_recaptcha:false }
      ]
    },
    tool_details: {
      logo: "assets/kbt-mini-logo.png",
      colors: {
        title: "#007628"
      },
      kbt: {
        link: "/kbt"
      },
      search_url: "/search",
      category_colors: {
        "Rural Areas": "#B67400",
        "Agriculture": "#9CB600",
        "Forestry": "#42B600"
      }
    },
    navbar: {
      logo: "assets/gnomee_logo.png",
      colors: {
        title: "#007628"
      },
      kbt: {
        link: "/kbt"
      },
      items: [
        {
          name: "Home",
          link: "/kbt/home",
          group:1,
          showOnlyOnAuthenticatedUser:true,
      },
      {
          name: "Dashboard",
          link: "/kbt/dashboard",
          group:1,
          showOnlyOnAuthenticatedUser:false,
      },
      {
          name: "Search",
          link: "/kbt/search",
          group:1,
          showOnlyOnAuthenticatedUser:false,
      },
      {
          name: "Browse",
          link: "/kbt/browse",
          group:1,
          showOnlyOnAuthenticatedUser:false,
      },
        {
          name: "Suggest a new Digital Tool",
          modalClass:"ToolSuggestionCreationModal",
          redirectionLinkOnAuthorized:"/kbt/digital-tool-suggestion",
          group:2,
          showOnlyOnUnauthenticatedUser: true
      },
        {
          name: "Sign In",
          link: "/kbt/signin",
          group:2,
          showOnlyOnUnauthenticatedUser: false,
          authenticated: {
            name: "Sign Out",
          }
        },
        {
          authenticated: {
            name: "Profile",
            link: "/kbt/my-profile",
            home:"/kbt/home"
          }
        }
      ]
    },
    analytics: {
      filter_indices_usage: {
        fill_color: '#3C9D9B'
      },
      filter_value_frequency: {
        fill_colors:
          [
            '#2a6e6d',
            '#368d8c',
            '#63b1af',
            '#8ac4c3',
            '#b1d8d7',
            '#d8ebeb',
            '#b1d8d7',
            '#8ac4c3',
            '#63b1af',
            '#368d8c'
          ]
      },
      search_terms: {
      },
      browsed_app_scenarios: {
        fill_color: '#3C9D9B'
      },
      browsed_filter_path: {
        fill_color: '#3C9D9B'
      },
      most_popular_value_in_filters: {
        domains: {
          icon: 'assets/domain.svg'
        },
        countries: {
          icon: 'assets/countries.svg'
        },
        digitalTechnologies: {
          icon: 'assets/digital_technologies.svg'
        },
        humanToolInteractions: {
          icon: 'assets/human_tool_interactions.svg'
        },
        physicalDigitalConnections: {
          icon: 'assets/physical_digital_connections.svg'
        }
      },
      visitor_countries: {
        title: '',
        subtitle: '',
        series: {name: 'Users Per Country'},
        states: {hover: {color: '#BADA55'}},
        height: 438
      },
      tool_relation_graph: {
        radius: {
          Domain: 45,
          Subdomain: 33,
          ApplicationScenario: 22,
          Tool: 9,
          DigitalTechnology: 22
        },
        nodeOpacity: {
          Domain: 1,
          Subdomain: 0.92,
          ApplicationScenario: 0.82,
          Tool: 0.7,
          DigitalTechnology: 0.82
        },
        fontSize: {
          Domain: '45px',
          Subdomain: '30px',
          ApplicationScenario: '20px',
          Tool: '0',
          DigitalTechnology: '20px'
        },
        edgeWidth: {
          Domain: 7.5,
          Subdomain: 4.5,
          ApplicationScenario: 1.0,
          Tool: 0.1,
          DigitalTechnology: 1.0
        },
        edgeOpacity: {
          Domain: 1,
          Subdomain: 0.6,
          ApplicationScenario: 0.3,
          Tool: 0.1,
          DigitalTechnology: 0.3
        },
        group: {
          Domain: 0,
          Subdomain: 1,
          ApplicationScenario: 2,
          Tool: 3,
          DigitalTechnology: 4
        },
        nodeStrength: -40,
        nodeStrengthWithDigitalTechnologies: -50,
        linkStrength: 0.01,
        linkStrengthWithDigitalTechnologies: 0.01,
        height: {
          'Agriculture': {
            notShowingDigitalTechnologies: 2000,
            showingDigitalTechnologies: 2000
          },
          'Forestry': {
            notShowingDigitalTechnologies: 1300,
            showingDigitalTechnologies: 1300
          },
          'Rural Areas': {
            notShowingDigitalTechnologies: 1800,
            showingDigitalTechnologies: 1800
          }
        },
        width: {
          'Agriculture': 2000,
          'Forestry': 2000,
          'Rural Areas': 2000
        },
        decayParameter: {
          notShowingDigitalTechnologies: 110,
          showingDigitalTechnologies: 110
        }
      }
    },
    visuals: {
      rows: [[[3, 4, 6, 7, 5]], [[9]], [[0], [1]], [[8]], [[2]]],
      charts: [{
        type: "barchart",
        data_service: "technology_usage_service",
        id: "tech_bar",
        fill_color: "#d04a35"
      },
      {
        type: "barchart",
        data_service: "get_human_tool_interactions_service",
        id: "tech_bar2",
        fill_color: "#22577A"
      },
      {
        type: "attribute-geomap",
        data_service: "country_tools_service",
        id: "country_map",
        title: "",
        subtitle: "",
        series: { name: "Tools Per Country" },
        states: { hover: { color: "#BADA55" } }
      },
      {
        type: "counter",
        data_service: "data_counters_service",
        id: "tools_counter",
        attribute: "tools",
        shared: true,
        file: "assets/dgc.svg",
        fill_color: "#80ED99"
      },
      {
        type: "counter",
        data_service: "data_counters_service",
        id: "countries_counter",
        attribute: "countries",
        shared: true,
        file: "assets/countries.svg",
        fill_color: "#57CC99"
      },
      {
        type: "counter",
        data_service: "data_counters_service",
        id: "appscenarios_counter",
        attribute: "applicationScenarios",
        shared: true,
        file: "assets/app_scenarios.svg",
        fill_color: "#22577A"
      },
      {
        type: "counter",
        data_service: "data_counters_service",
        id: "domains_counter",
        attribute: "domains",
        shared: true,
        file: "assets/domain.svg",
        fill_color: "#38A3A5"
      },
      {
        type: "counter",
        data_service: "data_counters_service",
        id: "subdomains_counter",
        attribute: "subdomains",
        shared: true,
        file: "assets/subdomain.svg",
        fill_color: "#38A3A5"
      },
      {
        type: "bubblechart",
        data_service: "get_popular_keywords_service",
        id: "tech_bar3",
      },
      {
        type: "most-visited-dts",
        data_service: "analytics_get_tool_visits",
        data_service_parameters: "topK=5",
      }
      ]
    },
    breadcrumb: {
      items: {
        home: {
          name: "Gnomee",
          link: "/kbt"
        },
        search: {
          name: "Search",
          link: "/kbt/search"
        },
        privacy: {
          name: "Privacy Policy",
          link: "/kbt/privacy"
        },
        about: {
          name: "About",
          link: "/kbt/about"
        },
        "terms-of-service": {
          name: "Terms of Service",
          link: "/kbt/terms-of-service"
        },
        contact: {
          name: "Contact Us",
          link: "/kbt/contact"
        },
        detailed: {
          name: "Tool Details",
          link: ""
        },
        browse: {
          name: "Browse",
          link: "/kbt/browse"
        },
        dashboard: {
          name: "Dashboard",
          link: "/kbt/dashboard"
        },
        signin: {
          name: "Sign In",
          link: "/kbt/signin"
        },
        profile: {
          name: "My Profile",
          link: "/kbt/profile"
        },
        "digital-tool-suggestion": {
          name: "Digital Tool Suggestion",
          link: "/kbt/digital-tool-suggestion"
        },
        user: {
          name: "User",
          link: ""
        },
      },
      paths: {
        search: ["home"],
        privacy: ["home"],
        about: ["home"],
        "terms-of-service": ["home"],
        contact: ["home"],
        detailed: ["home", "search"],
        browse: ["home"],
        dashboard: ["home"],
        signin: ["home"],
        profile: ["home"],
        "digital-tool-suggestion": ["home", "user"]
      }
    },
    browse: {
      colors: {
        "domain": "#206A5D",
        "digital technologies": "#00AF91",
        "interactions between human and tool": "#FFCC29",
        "connection between digital and physical objects": "#F58634",
        "rural areas": "#81B214",
        "agriculture": "#D3D6C1",
        "forestry": "#877131"
      },
      terminal: {
        color: {
          bg: "#D9D9D9",
          description: "#9FA5AA",
          title: "#089C89"
        },
        link: "/tool"
      }
    },
    search_page: {
      logo: "assets/kbt-mini-logo.png",
      colors: {
        title: "#007628"
      },
      kbt: {
        link: "/kbt"
      },
      img_settings: {
        w: 20,
        h: 25
      },
      tool_detailed_url: "/tool",
      imgs: [
        {
          id: "Rural Areas",
          file: "assets/rural areas.svg"
        },
        {
          id: "Agriculture",
          file: "assets/agriculture.svg"
        },
        {
          id: "Forestry",
          file: "assets/forestry.svg"
        }
      ]
    },
    landing_page: {
      logo: {
        file: "assets/gnomee_logo.png",
        w: 120,
        h: 100
      },
      mainlogo: {
        file: "assets/gnomee_logo.png",
      },
      colors: {
        welcome: "#606060",
        background: "#EAEAEA",
        title: "#606060",
        description: "#007628",
        links: "#089C89",
        "search-placeholder": "white"
      },
      text: {
        title: "Welcome to​ The DESIRA Knowledge Base Tool",
        description: "The DESIRA knowledge base of Digital Game Changers in Rural Areas",
        searchPlaceholder: "Search for Digital Game Changers"
      },
      font: {
        title: "2.5em"
      },
      submit: {
        url: "/search"
      },
      links: [
        {
          text: "Dashboard",
          url: "/kbt/dashboard"
        },
        {
          text: "Advanced Search",
          url: "/kbt/search"
        },
        {
          text: "Browse",
          url: "/kbt/browse"
        }
      ]
    },
    privacy: {
      logo: "assets/kbt-mini-logo.png",
      colors: {
        title: "#007628",
        background: "#d1d1d124"
      },
      kbt: {
        link: "/kbt"
      },
      img_settings: {
        w: 20,
        h: 25
      },
      toolName: "Gnomee"
    },
    about: {
      logo: "assets/kbt-mini-logo.png",
      colors: {
        title: "#007628",
        background: "#d1d1d124"
      },
      kbt: {
        link: "/kbt"
      },
      img_settings: {
        w: 20,
        h: 25
      },
      toolName: "Gnomee"
    },
    profile: {
      logo: "assets/kbt-mini-logo.png",
      colors: {
          title: "#007628",
          background: '#d1d1d124'
      },
      kbt: {
          link: "/kbt"
      },
      img_settings: {
          w: 20,
          h: 25
      },
      toolName: "Gnomee"
  },
    contact: {
      logo: "assets/kbt-mini-logo.png",
      colors: {
        title: "#007628",
        background: "#d1d1d124"
      },
      kbt: {
        link: "/kbt"
      },
      img_settings: {
        w: 20,
        h: 25
      },
      toolName: "Gnomee"
    },
    "terms-of-service": {
      logo: "assets/kbt-mini-logo.png",
      colors: {
          title: "#007628",
          background: "#d1d1d124"
      },
      kbt: {
          link: "/kbt"
      },
      img_settings: {
          w: 20,
          h: 25
      },
      toolName: "Gnomee"
  },
    footer: {
      eu: {
        file: "assets/europe.jpg",
        w: 50,
        h: 40,
        link: ""
      },
      desira: {
        file: "assets/Logo Desira_1.png",
        w: 120,
        h: 50,
        link: "https://desira2020.eu/"
      },
      athena: {
        file: "assets/athena_cropped.png",
        w: 160,
        h: 40,
        link: "https://www.imsi.athenarc.gr/en"
      },
      text: {
        funding: "This work is funded by the European Commission under the Horizon 2020 European research infrastructures grant agreement no. 818194",
        privacy: { "text": "Privacy Policy", "link": "/kbt/privacy" },
        "terms-of-service":{"text":"Terms of Service","link":"/kbt/terms-of-service"},
        about: { "text": "About", "link": "/kbt/about" },
        contact: { "text": "Contact Us", "link": "/kbt/contact" },
        cookies: "Manage Cookies"
      },
      font: {
        size: "0.83em"
      }
    },
    "dynamic-modal": {
      logo: {
        file: "assets/kbt-full-logo.png"
      },
      recaptchaLogo:{
        file:"assets/recaptcha.png",
        width:60,
        height:40
    }
    },
    "cookie-banner": {
      cookie_object_name: "kbt",
      notice_text: "This website uses cookies for analytics, improving your on-line experience and enabling third party features. If you agree, choose \"Accept all\", otherwise manage your preferences in \"Cookie settings\".",
      cookie_modal: {
        logo: {
          file: "assets/gnomee_logo.png",
          w: 150,
          h: 45
        },
        title: "How Gnomee uses cookies",
        content: ["Cookies are small pieces of data that are stored by a browser on a computer's hard drive, mobile phone or any other device used to access the internet. Gnomee uses cookies that are absolutely necessary for the operation of the website.", "In addition, with your consent Gnomee may collect analytical/ performance Cookies. These cookies allow to count the number of visitors and to improve website experience. They collect aggregated information (i.e. country, browser type, time and duration of website visit, etc.). With respect to analytical/ performance Cookies, Gnomee uses Google Analytics (Google Ireland Limited) that enable it to optimize website experience based on the specific user characteristics. For more information on the terms of personal data processing please review <a href='https://policies.google.com/privacy'>Google’s privacy policy</a>.", "You may change your cookie settings at any time to accept or refuse these analytics technologies.", "This page uses cookies to improve website experience. With your consent, we may collect cookies for statistical purposes. For more information see our privacy statement available <a href='/kbt/privacy'>here.</a>"],
        cookie_settings: {
          cookie_categories: [
            {
              name: "Strictly necessary / Basic Cookies",
              description: "Strictly necessary cookies are essential for the running of the website; they are also essential for you to browse the website and use its features. ",
              always_enabled: true,
              details: {},
              code: "sess",
              default_value: true,
              plugin: "session"
            },
            {
              name: "Analytical/Performance Cookies.",
              description: "These cookies allow us to count the number of visitors and to improve website experience. These cookies collect aggregated information (i.e. country, browser type, time and duration of website visit, etc.) ",
              always_enabled: false,
              details: {},
              code: "ga",
              default_value: false,
              plugin: "ga"
            }
          ]
        }
      }
    },
    "user-management":{
      "cookie-key":"gnomee-auth"
  },
  signIn:{
      redirectionLink:"/home",
      link:"/signin"
  }
  }
};
