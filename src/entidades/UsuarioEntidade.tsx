

export default class UsuarioEntidade {
	public OID_USUARIO: number;
	public NOM_LOGIN: string;
	public PWD_USUARIO: string;
	public IND_BLOQUEADO: string;
	public NUM_TENTATIVA: number;
	public DES_LOTACAO: string;
	public IND_ADMINISTRADOR: string;
	public IND_ATIVO: string;
	public NOM_USUARIO_CRIACAO: string;
	public DTA_CRIACAO?: Date;
	public NOM_USUARIO_ATUALIZACAO: string;
	public DTA_ATUALIZACAO?: Date;
	public CD_EMPRESA: string;
	public SEQ_RECEBEDOR?: number;
	public IND_PRIMEIRO_ACESSO: string;
}