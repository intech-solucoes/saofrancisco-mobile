import TbgIndiceValEntidade from "./TbgIndiceValEntidade";

export default class TbgIndiceEntidade {
	public OID_INDICE: number;
	public COD_INDICE: string;
	public DES_INDICE: string;
	public IND_PERIODICIDADE: string;
	public NUM_DIA_ANIV: number;
	public OBS_INDICE: string;
	public NOM_USUARIO_CRIACAO: string;
	public DTA_CRIACAO?: Date;
	public NOM_USUARIO_ATUALIZACAO: string;
	public DTA_ATUALIZACAO?: Date;
	public NUM_RAIZ: number;
	public Valores: Array<TbgIndiceValEntidade>;
}