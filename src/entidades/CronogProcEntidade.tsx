

export default class CronogProcEntidade {
	public CD_FUNDACAO: string;
	public CD_TIPO_FOLHA: string;
	public DT_REFERENCIA: Date;
	public DT_PROCESSAMENTO?: Date;
	public DT_LIM_REC_DOC?: Date;
	public DT_CRED_BANC?: Date;
	public DT_LIM_ALTERACAO?: Date;
	public USUARIO: string;
	public DT_PROC_USUARIO?: Date;
	public SITUACAO: string;
	public DT_INIC_SELEC?: Date;
	public DT_TERM_SELEC?: Date;
	public DT_VALORIZ_COTA?: Date;
	public DT_COMPETENCIA?: Date;
	public DT_REPROCESSAMENTO?: Date;
	public DT_FECHAMENTO?: Date;
	public DT_REL_PROCESSO?: Date;
	public DT_RETROATIVIDADE?: Date;
	public ABONO_ANUAL: string;
	public PERC_ABONO_ANUAL?: number;
	public DT_INTEGR_CONTAB?: Date;
	public DT_INTEGR_FINANC?: Date;
	public DT_INTEGR_COTAS?: Date;
	public VL_PERC_ADIANT?: number;
	public ID_PREVIA: string;
}