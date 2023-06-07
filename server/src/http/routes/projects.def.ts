import {Type} from "@sinclair/typebox";

export const CreateProjectBody = Type.Object({
	name: Type.String(),
});

export const CreateApiKeyBody = Type.Object({
	name: Type.String(),
});

export const CreateApiKeyParams = Type.Object({
	projectId: Type.String(),
});

export const CreateTagBody = Type.Object({
	name: Type.String(),
	color: Type.String(),
});

export const UpdateTagBody = Type.Object({
	id: Type.Number(),
	name: Type.String(),
	color: Type.String(),
});

export const DeleteApiKeyParams = Type.Object({
	projectId: Type.String(),
	apiKeyId: Type.String(),
});
