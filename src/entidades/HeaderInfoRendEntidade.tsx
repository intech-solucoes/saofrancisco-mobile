import InfoRendGrupoEntidade from "./InfoRendGrupoEntidade";

export default class HeaderInfoRendEntidade {
	public OID_HEADER_INFO_REND: number;
	public CD_EMPRESA: string;
	public CPF: string;
	public NUM_MATRICULA: string;
	public DESC_NATUREZA: string;
	public ANO_EXERCICIO: number;
	public ANO_CALENDARIO: number;
	public DATA_GERACAO: Date;
	public ORIGEM: string;
	public IND_RETENCAO: string;
	public NOME: string;
	public NOM_EMPRESA: string;
	public CNPJ_EMPRESA: string;
	public Grupos: Array<InfoRendGrupoEntidade>;
}