

export default class FichaFechamentoEntidade {
	public CD_FUNDACAO: string;
	public CD_EMPRESA: string;
	public CD_PLANO: string;
	public NUM_INSCRICAO: string;
	public ANO_REF: string;
	public MES_REF: string;
	public VL_GRUPO1: number;
	public VL_GRUPO2: number;
	public VL_GRUPO3: number;
	public VL_GRUPO4: number;
	public VL_GRUPO5: number;
	public VL_GRUPO6: number;
	public VL_LIQUIDO: number;
	public VL_COTA: number;
	public QTE_COTA: number;
	public QTE_COTA_ACUM?: number;
	public VL_ACUMULADO?: number;
	public DT_FECHAMENTO?: Date;
}