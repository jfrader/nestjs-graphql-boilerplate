export interface MutationResponseBase {
  success: boolean;
}

export type MutationResponse<DTO> = DTO & MutationResponseBase;
