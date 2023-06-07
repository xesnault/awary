import {Type} from "@sinclair/typebox";

export const CreateLogBody = Type.Object({
	title: Type.String(),
	content: Type.String(),
	tags: Type.Array(Type.String())
});

export const CreateLogParams = Type.Object({
	projectId: Type.String(),
});

export const DeleteLogParams = Type.Object({
	projectId: Type.String(),
	logId: Type.String(),
});
