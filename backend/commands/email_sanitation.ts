import { BaseCommand } from '@adonisjs/core/ace';
import type { CommandOptions } from '@adonisjs/core/types/ace';
import db from '@adonisjs/lucid/services/db';
import isReachable from 'is-reachable';

export default class EmailSanitation extends BaseCommand {
  static commandName = 'email:sanitation';
  static description = 'Verificação de dominios';

  static options: CommandOptions = {
    startApp: true,
  };

  knownDomains = new Set([
    'gmail.com',
    'yahoo.com',
    'yahoo.com.br',
    'globo.com',
    'hotmail.com',
    'outlook.com',
    'aol.com',
    'icloud.com',
    'mail.com',
    'live.com',
    'msn.com',
    'protonmail.com',
    'zoho.com',
    'gmx.com',
    'yandex.com',
    'qq.com',
    '163.com',
    '126.com',
    'sina.com',
    'weibo.com',
    'r7.com',
    'terra.com.br',
    'bol.com.br',
    'systeminteract.com.br',
    'flexcontact.com.br',
    'outlook.com',
    'alphavox.com.br',
    'zipmail.com.br',
    'aol.com',
    'msn.com',
    'tem.com.br',
    'correioweb.com.br',
    'predialadm.com.br',
    'mtv.com.br',
    'cidadeinternet.com.br',
    'pmm.am.gov.br',
    'imobiliariametropole.com.br',
    'cdlmanaus.com.br',
    'ifpi.edu.br',
    'pop.com.br',
    'petrobras.com.br',
    'correios.com.br',
    'me.com',
    'forum.ufrj.br',
    'sefaz.pi.gov.br',
    'nao.com',
    'armazemparaiba.com.br',
    'br.inter.net',
    'grupocarvalho.com.br',
    'hi2.in',
    'click21.com.br',
    'veloxmail.com.br',
    'facebook.com',
    'nao.com.br',
    'bb.com.br',
    'linkbr.com.br',
    'seduc.net',
    'rocketmail.com',
    'flexcontact.com',
    'rochaerocha.com.br',
    'bool.com.br',
    'honda.com.br',
    'bnb.gov.br',
    'cabralgama.com',
    'canadaveiculos.com.br',
    'osite.com.br',
    'email.com',
    'tjpi.jus.br',
    'systemmarketing.com',
    'alphavox.com',
    'tutopia.com.br',
    'bemol.com.br',
    'embrapa.br',
    'halcaimobiliaria.com.br',
    'mar.com.br',
    'ig.com',
    'inss.gov.br',
    'bradesco.com.br',
    'gns.com.br',
    'uol.com',
    'ufpi.br',
    'speedy.com.br',
    'webone.com.br',
    'patrimonial.adm.br',
    'saude.gov.br',
    'eletrobraspiaui.com',
    'trf1.jus.br',
    'meionorte.com',
    'unimedteresina.com.br',
    'outlook.pt',
    'ufam.edu.br',
    'embratel.com.br',
    'netpar.com.br',
    'hot.com',
    'agu.gov.br',
    'univelox.com.br',
    'uninovafapi.edu.br',
    'protonmail.com',
    'mailbr.com.br',
    'ambev.com.br',
    'guiando.com.br',
    'marinha.mil.br',
    'crc.net.br',
    'ibge.gov.br',
    'onda.com.br',
    'samsung.com',
    'medimagem.com.br',
    'sotreq.com.br',
    'jeltaveiculos.com.br',
    'compuserv.com.br',
    'humanasaude.com.br',
    'pi.sebrae.com.br',
    'meirelesefreitas.com.br',
    'aegea.com.br',
    'viaparisnet.com.br',
    'semed.manaus.am.gov.br',
    'secrel.com.br',
    'hydro.com',
    'hotsat.com.br',
    'tce.pi.gov.br',
    'construtorajurema.com.br',
    'atacadao.com.br',
    'alemanhaveiculos.com.br',
    'direcional.com.br',
    'halleysa.com.br',
    'receita.fazenda.gov.br',
    'estacio.br',
    'uai.com.br',
    'folha.com.br',
    'jabil.com',
    'suhab.am.gov.br',
    'prf.gov.br',
    'credishop.com.br',
    'cprm.gov.br',
    'pintos.com.br',
    'grupomateus.com.br',
    'infolink.com.br',
    'hotnail.com',
    'construtorarivello.com.br',
    'fiocruz.br',
    'saomarcos.org.br',
    'gimail.com',
    'trt11.jus.br',
    'houston.com.br',
    'rsi.com.br',
    'tbl.com.br',
    'yahoo.fr',
    'sefaz.am.gov.br',
    'grupoluauto.com.br',
    'yopmail.com',
    'fieam.org.br',
    'pi.senac.br',
    'aguasdeteresina.com.br',
    'fortalnet.com.br',
    'r7.com.br',
    'yamaha-motor.com.br',
    'simonet.com.br',
    'ieg.com.br',
    'manausimovel.com.br',
    'solnascentemotos.com.br',
    'portochibatao.com.br',
    'life.com',
    'hotlink.com.br',
    'sobralnet.com.br',
    'pecicero.com.br',
    'newland.com.br',
    'cedae.com.br',
    'adventistas.org',
    'importadorasumare.com.br',
    'pg.com',
    'am.senac.br',
    'aadvance.com.br',
    'gmx.net',
    'tpv-tech.com',
    'cnmotos.com.br',
    'amazonaco.com.br',
    'sapo.pt',
    'prolagos.com.br',
    'dombarreto.g12.br',
    'planaltopetroleo.com.br',
    'yahoo.co.uk',
    'yahoo.com.ar',
    'usp.br',
    'ciclocairu.com.br',
    'grupotapajos.com.br',
    'telefonica.com',
    'fogas.com.br',
    'mcarvalho.com.br',
    'grupocanopus.com.br',
    'coifeodonto.com',
    'outllook.com',
    'quadrangular.com.br',
    'ittnet.com.br',
    'riachuelo.com.br',
    'servi-san.com.br',
    'acmanaus.com.br',
    'predialnet.com.br',
    'anatel.gov.br',
    'jcam.com.br',
    'centroin.com.br',
    'terra.com',
    'klik.com.br',
    'grupocetseg.com.br',
    'construtorasucesso.com.br',
    'adjuve.com.br',
    'gruposimoes.com.br',
    'yahoo.it',
    'representacoesrer.com.br',
    'elizeumartins.com.br',
    'autotrac.com.br',
    'auf.org',
    'adibo.com.br',
    'servicar.com.br',
    'tavola.com.br',
    'dba.com.br',
    'pensecred.com.br',
    'mafrensemaquinas.com.br',
    'igrejadorecreio.org.br',
    'fundimec.com.br',
    'habg.com.br',
    'zipsaude.com.br',
    'mdat.com.br',
    'flowserve.com',
    'ocres.net',
    'bangtoys.com.br',
    'rainhaisabel.com.br',
    'colorobbia.com.br',
    'vergroup.com.br',
    'mundialdist.com.br',
    'mpma.mp.br',
    'eram.com.br',
    'houer.com.br',
    'ibtinc.com',
    'barreto.com.br',
    'clinilabam.com.br',
    'sinape.com.br',
    'bemsolucoes.com.br',
    'brandy.com.br',
    'nader.com.br',
    'percol.com.br',
    'foster.com.br',
    'beny.com.br',
    'mcs.com.br',
    'acontcontabil.com',
    'institutoanahickmann.com.br',
    'macsoftinfo.com.br',
    'mmv13.com.br',
    'acit.com.br',
    'anhangueraferramentas.com.br',
    'sabesp.com.br',
    'heineken.com.br',
    'ifnet.com.br',
    'technologist.com',
    'out.com.br',
    'liberalseguros.com.br',
    'praticonet.com.br',
    'argo.com',
    'dell.com',
    'ace-sc.com.br',
    'canoense.com.br',
    'itaporanga.com.br',
    'autofax.com.br',
    'novared.cl',
    'amorimvedacoes.com.br',
    'connectmed.com.br',
    'aneethun.com',
    'amazonetiqueta.com.br',
    'executiveflat.com.br',
    'redomino.com',
    'agroam.com.br',
    'otis.com',
    'gruporsa.com.br',
    'com4.com.br',
    'cursobiblico.com.br',
    'ailha.com.br',
    'ie.ufrj.br',
    'rocketemail.com',
    'fiorde.com.br',
    'funarte.gov.br',
    'esmepi.org.br',
    'arquitetasophia.com',
    'tanet.com.br',
    'samot.com.br',
    'controle-am.com.br',
    'mcrtecnologia.com',
    'gruporosinetos.com',
    'foxtelecomunicacoes.com.br',
    'ma.sebrae.com.br',
    'imerys.com',
    'braspress.com.br',
    'lavamais.com.br',
    'mpaixao.com.br',
    'libis.com.br',
    'touchofclass.com.br',
    'sunrise.ch',
    'desinfast.com.br',
    'cargotransportes.com.br',
    'baixuvillage.com.br',
    'ibbi.com.br',
    'sextante.ind.br',
    'mrn.com.br',
    'gg-imoveis.com',
    'brascrew.com.br',
    'henrimarhelicopteros.com.br',
    'macola.com.br',
    'quanticabrasil.com.br',
    'gustr.com',
    'sunrise.com.br',
    'valefeliz.com.br',
    'itok.com',
    'motivare.com.br',
    'hotelcastelar.com.br',
    'palowa.com.br',
    'pousadaamazonia.com.br',
    'trt8.jus.br',
    'multiplacvisual.com.br',
    'gineco.med.br',
    'transamerica.com.br',
    'sedecti.am.gov.br',
    'laviniense.com.br',
    'santaclaraensino.com.br',
    'mmsantos.com.br',
    'cide.org.br',
    'co2zero.eco.br',
    'portofino.com.br',
    'doew.at',
    'nortplast.com.br',
    'ems.psu.edu',
    'urca.br',
    'dc.ind.br',
    'multpex.com.br',
    'holistica.com.br',
    'cervejaimperio.com.br',
    'magioli.com',
    'maxproj.com.br',
    'epimacae.com.br',
    'hotelprincipe.com.br',
    'fortinox.com',
    'arapongas.com.br',
    'acib.com.br',
    'transroute.com.br',
    'liliane.com.br',
    'vetvale.vet.br',
    'daniembalagens.com.br',
    'lions.com.br',
    'mdpapeis.com.br',
    'brasileirinhas.com.br',
    'culturainglesamanaus.com.br',
    'rj.gov.br',
    'cbpm.com.br',
    'metalfecho.com.br',
    'rambeer.com.br',
    'quedasdagua.com.br',
    'netwalk.com.br',
    'flamex.com.br',
    'realfood.com.br',
    'mg-exim.com.br',
    'rci.com.br',
    'iigd.com.br',
    'betrock.com',
    'cck.com.br',
    'stn.com.br',
    'fenixnet.com.br',
    'serrasmelo.com.br',
    'compuletra.com.br',
    'bemismfg.com',
    'opas.org.br',
    'dmi.com',
    'okeimoveis.com.br',
    'grupomagister.com.br',
    'sindiconet.com.br',
    'credip.com.br',
    'pontanegra.com.br',
    'cesar.org.br',
    'sergiolemos.com',
    'yupimail.com',
    'contabilidadeunipress.com.br',
    'hotelpraiadosanjos.com.br',
    'rnp.br',
    'aguascalientes.gob.mx',
    'deltageo.com.br',
    'artven.com.br',
    'upei.com.br',
    'pge.am.gov.br',
    'techs.com.br',
    'live.fr',
    'viacometa.com.br',
    'metalink.com.br',
    'magnaniimoveis.com.br',
    'casadoautoeletrico.com.br',
    'paradisetur.com.br',
    'uniara.com.br',
    'globbo.com',
    'startupsolar.com.br',
    'carmoucheinsurance.com',
    'rms.com.br',
    'fermen.to',
    'ufs.br',
    'centervansemicros.com.br',
    'portodabarrabuzios.com.br',
    'grupounipar.com.br',
    'live20.com',
    'pacificlog.com.br',
    '100porcentolog.com.br',
    'macaubas.com',
    'ofm.com.br',
    'brabec.com.br',
    'pbase.com',
    'corretoraideal.com.br',
    'provesul.com.br',
    'ocrim.com.br',
    'bcpengenharia.com.br',
    'orlatelecom.com.br',
    'arris.com',
    'conectanet.com.br',
    'welcome.com.br',
    'mirandex.com.br',
    'casacivil.am.gov.br',
    'maxpelam.com.br',
    'anaterra.com.br',
    'rech.com.br',
    'pamphili.com.br',
    'aseconcontabil.com.br',
    'hildaferreira.com.br',
    'sitari.com.br',
    'alegrete.com.br',
    'motamachado.com.br',
    'laurimar.com.br',
    'stefanini.com',
    'contacab.com.br',
    'digix.com.br',
    'metrorio.com.br',
    'crp21.org.br',
    'actech.com.br',
    'twin-net.com.br',
    'skydome.net',
    'ronaconsultoria.com.br',
    'andressaleao.com.br',
    'grupoconcrenorte.com.br',
    'mascat.com.br',
    'acessoriosfs.com.br',
    'asbrasil.com.br',
    'leonardo.com',
    'amartins.net',
    'ipcms.com.br',
    'trilhadagua.com.br',
    'vaninanemer.com.br',
    'confispa.com.br',
    'netonne.com.br',
    'bretanha.com.br',
    'turbocenter.com.br',
    'socorrocarvalho.com.br',
    'uchoateresinahotel.com',
    'dentsday.com.br',
    'condominiomondrian.com',
    'hubbell.com',
    'silveiraecaete.com.br',
    'selecta.com.br',
    'bancamediolanum.it',
    'fidelize.com.br',
    'sicoob.com.br',
    'medplan.com.br',
    'sacavalcante.com.br',
    'serpro.gov.br',
    'grupofranly.com.br',
    'samerimobiliaria.com.br',
    'razengenharia.com.br',
    'sinduscon-al.com.br',
    'davincihotel.com.br',
    'transhernandes.com.br',
    'marmovidro.com.br',
    'web.de',
    'trt16.jus.br',
    'gconte.com.br',
    'saude.pi.gov.br',
    'lafarge.com',
    'viacaosaopedro.com',
    'pdg.com.br',
    'light.com.br',
    'ejcrefrigeracao.com.br',
    'kodak.com',
    'jsbdistribuidora.com.br',
    'aguasdemanaus.com.br',
    'pimentabueno.ro.gov.br',
    'uniaobrasil.org.br',
    'lojasnoroeste.com.br',
    'gov.br',
    'libero.it',
    'am.sebrae.com.br',
    'aleam.gov.br',
    'se.com',
    'objetivopi.com.br',
    'infonet.com.br',
    'viamarconi.com.br',
    'brasiltecnologia.net.br',
    'hsp.com.br',
    'sfiec.org.br',
    'sadia.com.br',
    'tre-am.jus.br',
    'cimentoapodi.com.br',
    'credipi.com.br',
    'amee.com.br',
    'hiroshima.com.br',
    'grupopmz.com.br',
    'elo.com.br',
    'vale.com',
    'ccncertificadora.com.br',
    'kazoly.com.br',
    'nettravelrm.com.br',
    'exatacargo.com.br',
    'colegioinove.com.br',
    'oratelecom.com.br',
    'glacial.com.br',
    'nortimoveis.com.br',
    'ncr.com',
    'esmg.com.br',
    'ciesa.br',
    'cbtu.gov.br',
    'imoveisveneza.com.br',
    'leomadeiras.com.br',
    'tre-pi.jus.br',
    'cajueiromotos.com.br',
    'medhaus.med.br',
    'carrefour.com',
    'caloi.com',
    'eucatur.com.br',
    'barataodacarne.com.br',
    'ipiranga.com.br',
    'geocities.com',
    'eloengenharia.net',
    'electrolux.com.br',
    'cemig.com.br',
    'samel.com.br',
    'wikitelecom.com.br',
    'netuno.com.br',
    'sky.com.br',
    'telecomam.com.br',
    'livre.com.br',
    'sefin.ro.gov.br',
    'caixacrescer.com.br',
    'jrm.com.br',
    'agi.com.br',
    'quitandafreitas.com.br',
    'unisys.com.br',
    'engeco.com.br',
    'tbforte.com.br',
    'cnec.br',
    'kasinski.com.br',
    'grupochibatao.com.br',
    'beconal.com.br',
    'fapema.br',
    'cultura.am.gov.br',
    'accenture.com',
    'ariquemes.ro.gov.br',
    'certto.com.br',
    'acritica.com.br',
    'hospitaldoolho.com',
    'marvel.com.br',
    'imagemsat.com.br',
    'kds.com.br',
    'mmvpneus.com.br',
    'amazon.com.br',
    'sesipr.com.br',
    'mobimark.com.br',
    'desinsetlagos.com.br',
    'wipecaseservicos.com.br',
    'construtoracapital.com.br',
    'brf-br.com',
    'setorzero.com.br',
    'grupocasal.com.br',
    'yahoo.de',
    'remacmais.com',
    'yahoo.es',
    'agibank.com.br',
    'cassi.com.br',
    'reconcretpi.com.br',
    'teracom.com.br',
    'yahoo.ca',
    'firjan.com.br',
    'proton.me',
    'frigotil.com.br',
    'huawei.com',
    'seculomanaus.com.br',
    'kfe.com.br',
    'marisa.com.br',
    'martinsimport.com.br',
    'meneportella.com.br',
    'tecnisa.com.br',
    'iron.com.br',
    'unip.br',
    'mpam.mp.br',
    '3coracoes.com.br',
    'grupobrasanitas.com.br',
    'oglobo.com.br',
    'atarde.com.br',
    'suzano.com.br',
    'carmensteffens.com.br',
    'klabin.com.br',
    'accor.com',
    'viasoft.com.br',
    'bndes.gov.br',
    'armazemparaiba.com',
    'ufba.br',
    'vivo.com',
    'casadoconstrutor.com.br',
    'sicredi.com.br',
    'ariquemes.com.br',
    'ufv.br',
    'shell.com',
    'ufrgs.br',
    'amazon.com',
    'pfizer.com',
    'caaaluminio.com.br',
    'totvs.com.br',
    'microsoft.com',
    'ticket.com.br',
    'fox.com',
    'bombril.com.br',
    'fasano.com.br',
    'casadomotorista.com.br',
    'brasiltecnologia.net.br',
    'totvs.com.br',
    'makro.com.br',
    'solvay.com',
    'amazongas.com.br',
    'supergasbras.com.br',
    'energiletrica.com.br',
  ]);

  async run() {
    this.logger.info('Hello world from "EmailSanitation"');

    const registros = await db
      .from('recupera.tbl_arquivos_cliente_numero')
      .select(db.raw("split_part(trim(contato), '@', 2) AS dominio"))
      .count('* as quantidade')
      .where('tipo_contato', 'EMAIL')
      .andWhere('contato', 'LIKE', '%@%')
      .andWhere('is_domain_valid', false) // Filtra apenas onde is_domain_valid é false
      .groupByRaw("split_part(trim(contato), '@', 2)")
      .orderBy('quantidade', 'desc');

    for (const registro of registros) {
      const { dominio } = registro;

      let isValid: boolean;

      if (this.knownDomains.has(dominio.toLowerCase())) {
        // Domínio conhecido, marcar automaticamente como válido
        isValid = true;
        //console.log(`Domínio ${dominio} é conhecido e considerado válido.`);
      } else {
        // Domínio desconhecido, realizar a verificação online
        isValid = await isReachable(`https://${dominio.toLowerCase()}`);

        if (isValid) {
          console.log(dominio.toLowerCase());
        }
      }

      // Atualiza todos os registros correspondentes ao domínio
      await db
        .from('recupera.tbl_arquivos_cliente_numero')
        .where('tipo_contato', 'EMAIL')
        .andWhere('contato', 'ILIKE', `%@${dominio}%`)
        .andWhere('is_domain_valid', false) // Filtra apenas onde is_domain_valid é false
        .update({ is_domain_valid: isValid });

      //console.log(`Atualizado domínio ${dominio} -> ${isValid}`);
    }
  }
}
