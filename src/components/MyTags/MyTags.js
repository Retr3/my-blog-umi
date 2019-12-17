import { Input, Tag, Icon } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';

export default function MyTags({tags,tagInputVisible,tagValue,removeTag,showTagInput,tagInputChange,tagInputConfirm,tagSaveInputRef}){
    const forMap = tag => {
        const tagElem = (
          <Tag
            closable
            onClose={e => {
              e.preventDefault();
              removeTag(tag);
            }}
          >
            {tag}
          </Tag>
        );
        return (
          <span key={tag} style={{ display: 'inline-block' }}>
            {tagElem}
          </span>
        );
    };
    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <TweenOneGroup
                enter={{
                    scale: 0.8,
                    opacity: 0,
                    type: 'from',
                    duration: 100,
                    onComplete: e => {
                    e.target.style = '';
                    },
                }}
                leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                appear={false}
                >
                {tags.map(forMap)}
                </TweenOneGroup>
            </div>
            {tagInputVisible && (
                <Input
                ref={tagSaveInputRef}
                type="text"
                maxLength={5}
                size="small"
                style={{ width: 78 }}
                value={tagValue}
                onChange={tagInputChange}
                onBlur={tagInputConfirm}
                onPressEnter={tagInputConfirm}
                />
            )}
            {!tagInputVisible && (
                <Tag onClick={showTagInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
                    <Icon type="plus" />
                </Tag>
            )}
        </div>
    )
}