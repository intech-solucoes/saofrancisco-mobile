

export default class HistRendasEntidade {
	public CD_FUNDACAO: string;
	public CD_EMPRESA: string;
	public CD_PLANO: string;
	public CD_ESPECIE: string;
	public NUM_PROCESSO: number;
	public ANO_PROCESSO: string;
	public DT_INIC_VALIDADE: Date;
	public CD_MOT_ALT_RENDA: string;
	public CD_OPCAO_RECEB: string;
	public VL_RENDA_FUNDACAO?: number;
	public VL_RENDA_PREVIDENCIA?: number;
	public VL_SAL_BENEF_FUNDACAO?: number;
	public VL_SAL_BENEF_PREVIDENCIA?: number;
	public VL_PARCELA_MENSAL?: number;
	public VERSAO: number;
	public VL_ABONO_APOSENT?: number;
	public VL_BENEF_MINIMO?: number;
	public VL_BASE_SRB?: number;
	public VL_BASE_PREVIDENCIA?: number;
	public VL_BASE_AB_APOSENT?: number;
	public BONUS_SUPLEMENTAR: string;
	public VL_ABONO_APOS_SLIM?: number;
	public VL_INSS_SLIM?: number;
	public RENDA_INSS_MIN: string;
	public OPCAO_RECB_13: string;
	public VL_TX_ANUAL?: number;
	public CD_TIPO_CALC_CD?: number;
	public VL_SRC_CONTRIB_AUX_DOENCA?: number;
	public NUM_TOT_PARCELAS?: number;
	public VL_SAL_BENEF_JUDICIAL?: number;
	public PERC_RESERVA?: number;
	public VL_IND_COTA?: number;
}