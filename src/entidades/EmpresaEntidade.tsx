import PlanoEntidade from "./PlanoEntidade";

export default class EmpresaEntidade {
	public CD_FUNDACAO: string;
	public CD_EMPRESA: string;
	public COD_ENTID: number;
	public IND_RESERVA_POUP: string;
	public IND_FUNDO: string;
	public CALCULA_SRC: string;
	public PERCENT_DIF_CONTRIB?: number;
	public QTDE_MESES_INF?: number;
	public INDICE_PLANO: string;
	public TP_RATEIO?: number;
	public IND_PASSIVO: string;
	public CD_EMPRESA_CT?: number;
	public EXC_PRESTADORA?: number;
	public NUM_CD_CC?: number;
	public NUM_CD_DR?: number;
	public NUM_CD_AM?: number;
	public COD_MCI: string;
	public SIAPE?: number;
	public IND_RES_MATEM: string;
	public NUM_CD_PT?: number;
	public NUM_SEQUENCIAL_COBRANCA?: number;
	public IND_CALC_PROJETADO: string;
	public IND_MATRIC_IGUAL_INSC: string;
	public IND_INSC_IGUAL_MATRIC: string;
	public CK_SEQ_MATRICULA: string;
	public NOME_ENTID: string;
	public CPF_CGC: string;
	public Planos: Array<PlanoEntidade>;
}