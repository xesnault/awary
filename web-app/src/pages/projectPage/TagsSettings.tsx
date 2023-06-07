import {useState} from "react"
import {useApi} from "../../api"
import Button from "../../components/Button"
import Card from "../../components/Card"
import LineEdit from "../../components/Input"
import {Project} from "../../core/Project"
import {TagData} from "../../core/Tag"
import {useModal} from "../../services/ModalService"
import {TagForm} from "./forms/TagForm"
import {TagSticker} from "./LogsTab"

function clone<T>(x: T): T {
	return JSON.parse(JSON.stringify(x))
}

interface TagsSettingsProps {
	project: Project
	onUpdate: () => void
}

export function TagsSettings({project, onUpdate}: TagsSettingsProps) {
	const api = useApi()
	const modalService = useModal()

	const [tags, setTags] = useState(project.tags)

	const createTag = async (data: TagData) => {
		await api.createTag(project.id, data);
		onUpdate();
	}

	const updateTags = async () => {
		await Promise.all(tags.map(async tag => {
			const originalTag = project.tags.find(originaltag => originaltag.id === tag.id)
			if (originalTag && (originalTag.name !== tag.name || originalTag.color !== tag.color)) {
				await api.updateTag(project.id, tag);
			}
		}))
		onUpdate();
	}

	const header = 
		<div className="f-r justify-between">
			<h2>Tags</h2>
			<Button
				text="Create tag"
				onClick={() => {modalService.addModal((close) => <TagForm close={close} onCreate={createTag}/>)}}
			/>
		</div>

	const setNameOfTag = (tagIndex: number, name: string) => {
		const newTags = clone(tags)
		newTags[tagIndex].name = name
		setTags(newTags)
	}

	const setColorOfTag = (tagIndex: number, color: string) => {
		const newTags = clone(tags)
		newTags[tagIndex].color = color
		setTags(newTags)
	}

	return (
		<div className="f-c gap-4 flex-1">
			<Card header={header}>
				<div className="f-c gap-2">
					{tags.map((tag, tagIndex) =>
						<div key={tagIndex} className="f-r items-center gap-2">
							<LineEdit value={tag.name} onChange={(value) => {setNameOfTag(tagIndex, value)}}/>
							<input type="color" value={tag.color} onChange={(event) => {setColorOfTag(tagIndex, event.target.value)}}/>
						</div>
					)}
					<Button text="Save" onClick={updateTags}/>
				</div>
			</Card>
		</div>
	)
}
