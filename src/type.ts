export enum WAStatus {
	Unknown = "unknown",
    WaitQrcodeAuth = "wait_for_qrcode_auth",
    Authenticated = "authenticated",
    PullingWAData = "pulling_wa_data",
    Connected = "connected",
    Disconected = "disconected"
}
