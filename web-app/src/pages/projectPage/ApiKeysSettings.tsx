import {useCallback, useEffect, useState} from "react"
import {useApi} from "../../api"
import Button from "../../components/Button"
import Card from "../../components/Card"
import {ApiKey, ApiKeyData} from "../../core/ApiKey"
import {Project} from "../../core/Project"
import {useModal} from "../../services/ModalService"
import {ApiKeyForm} from "./forms/apiKeyForm"

interface ApiKeysSettingsProps {
	project: Project
}

export function ApiKeysSettings({project}: ApiKeysSettingsProps) {
	const api = useApi()
	const modalService = useModal()
	const [keys, setKeys] = useState<ApiKey[]>([])

	const fetchKeys = useCallback(async () => {
		const keys = await api.fetchProjectApiKeys(project.id);
		setKeys(keys)
	}, [api, project])

	const generateApiKey = async (data: Omit<ApiKeyData, "id">) => {
		await api.generateApiKey(project.id, data);
		fetchKeys();
	}

	const deleteApiKey = async (id: string) => {
		await api.deleteApiKey(project.id, id);
		fetchKeys();
	}

	useEffect(() => {
		fetchKeys();
	}, [fetchKeys])

	return <div className="f-c gap-4">
		<Button
			text="Generate API key"
			onClick={() => {modalService.addModal((close) => <ApiKeyForm close={close} onCreate={generateApiKey}/>)}}
		/>
	{
		keys.map(key =>
			<Card
				key={key.id}
				header={
					<div className="f-r justify-between">
						{key.name}
						<Button
							text="Delete"
							color="danger"
							onClick={() => {
								modalService.confirmation("Delete key ?", () => deleteApiKey(key.id))
							}}
						/>
					</div>}
			>
				{key.key}	
			</Card>
		)
	}
	</div>
}
