

export default class FichaFinanceiraAssistidoEntidade {
	public CD_FUNDACAO: string;
	public CD_EMPRESA: string;
	public CD_PLANO: string;
	public CD_ESPECIE: string;
	public NUM_PROCESSO: number;
	public ANO_PROCESSO: string;
	public SEQ_RECEBEDOR: number;
	public DT_REFERENCIA: Date;
	public DT_COMPETENCIA: Date;
	public CD_RUBRICA: string;
	public SEQ_RECEBEDOR_PENSAO: number;
	public VALOR_MC?: number;
	public VALOR_CT?: number;
	public PRAZO?: number;
	public CD_TIPO_FOLHA: string;
	public GB__CD_FUNDACAO: string;
	public NUM_PRESTACAO?: number;
	public TOT_PRESTACAO?: number;
	public VL_BASE_CALC?: number;
	public CAMPO_CALCULADO: string;
	public COD_COBRANCA: string;
	public DS_RUBRICA: string;
	public DS_ESPECIE: string;
	public RUBRICA_PROV_DESC: string;
	public ID_RUB_SUPLEMENTACAO: string;
	public IsAbonoAnual: boolean;
	public VAL_BRUTO?: number;
	public VAL_DESCONTOS?: number;
	public VAL_LIQUIDO?: number;
	public DS_TIPO_FOLHA: string;
}