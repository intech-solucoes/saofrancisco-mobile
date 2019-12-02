

export default class ProtocoloEntidade {
	public OID_PROTOCOLO: number;
	public OID_FUNCIONALIDADE: number;
	public COD_IDENTIFICADOR: string;
	public CD_FUNDACAO: string;
	public CD_EMPRESA: string;
	public CD_PLANO: string;
	public NUM_MATRICULA: string;
	public SEQ_RECEBEDOR?: number;
	public DTA_SOLICITACAO: Date;
	public DTA_EFETIVACAO?: Date;
	public TXT_MOTIVO_RECUSA: string;
	public TXT_TRANSACAO: string;
	public TXT_TRANSACAO2: string;
	public TXT_USUARIO_SOLICITACAO: string;
	public TXT_USUARIO_EFETIVACAO: string;
	public TXT_IPV4: string;
	public TXT_IPV6: string;
	public TXT_DISPOSITIVO: string;
	public TXT_ORIGEM: string;
	public TXT_IPV4_EXTERNO: string;
}