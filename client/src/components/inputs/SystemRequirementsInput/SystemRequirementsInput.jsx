import { useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { cn } from '@/utils/cn'
import TextInput from '@/components/inputs/TextInput/TextInput'
import Button from '@/components/buttons/Button/Button'

const DEFAULT_REQUIREMENTS = [
  { key: 'os', label: 'OS' },
  { key: 'processor', label: 'Processor' },
  { key: 'memory', label: 'Memory' },
  { key: 'graphics', label: 'Graphics' },
  { key: 'directx', label: 'DirectX' },
  { key: 'storage', label: 'Storage' },
  { key: 'network', label: 'Network' },
  { key: 'sound', label: 'Sound Card' },
]

function RequirementRow({ key: keyProp, value, onChangeKey, onChangeValue, onRemove, index, isCustom }) {
  const [customKey, setCustomKey] = useState('')

  const handleKeyChange = (e) => {
    const val = e.target.value
    setCustomKey(val)
    onChangeKey(index, val)
  }

  const isDefault = DEFAULT_REQUIREMENTS.some(r => r.key === keyProp)

  return (
    <div className="flex items-start gap-2">
      {isDefault ? (
        <TextInput
          value={keyProp}
          onChange={handleKeyChange}
          disabled
          className="w-36 shrink-0 bg-surface/50 text-on-surface-muted"
          aria-label="Requirement key"
        />
      ) : (
        <TextInput
          value={customKey || keyProp}
          onChange={handleKeyChange}
          placeholder="Custom key"
          className="w-36 shrink-0"
          aria-label="Requirement key"
        />
      )}
      <TextInput
        value={value}
        onChange={(e) => onChangeValue(index, e.target.value)}
        placeholder="Value"
        className="flex-1"
        aria-label="Requirement value"
      />
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${keyProp} requirement`}
        className="shrink-0 grid size-9 cursor-pointer place-items-center rounded-md border border-border text-on-surface-muted transition-colors hover:border-danger/50 hover:text-danger hover:bg-danger/5"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  )
}

export function SystemRequirementsInput({ label, value, onChange, required = false }) {
  const [items, setItems] = useState(() => {
    if (!value || typeof value !== 'object') return []
    return Object.entries(value).map(([key, val]) => ({ key, value: String(val) }))
  })

  const updateItems = (newItems) => {
    setItems(newItems)
    const obj = Object.fromEntries(newItems.map(i => [i.key, i.value]))
    onChange(obj)
  }

  const addItem = () => {
    const newItem = { key: '', value: '' }
    const newItems = [...items, newItem]
    updateItems(newItems)
  }

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index)
    updateItems(newItems)
  }

  const changeKey = (index, key) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], key }
    updateItems(newItems)
  }

  const changeValue = (index, value) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], value }
    updateItems(newItems)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-body-sm font-medium text-on-surface">
          {label} {required && <span className="text-error">*</span>}
        </label>
        <Button type="button" variant="tertiary" size="sm" onClick={addItem} className="gap-1.5">
          <Plus className="size-3.5" />
          Add row
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-body-sm text-on-surface-muted text-center py-4">
          No requirements added yet. Click "Add row" to start.
        </p>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <RequirementRow
              key={`${item.key}-${index}`}
              keyProp={item.key}
              value={item.value}
              onChangeKey={changeKey}
              onChangeValue={changeValue}
              onRemove={() => removeItem(index)}
              index={index}
              isCustom={!DEFAULT_REQUIREMENTS.some(r => r.key === item.key)}
            />
          ))}
        </div>
      )}

      <details className="mt-3">
        <summary className="cursor-pointer text-body-sm text-primary hover:text-primary-strong flex items-center gap-1.5">
          <Plus className="size-3.5" />
          Quick-add common fields
        </summary>
        <div className="mt-2 flex flex-wrap gap-2">
          {DEFAULT_REQUIREMENTS.map((req) => {
            const exists = items.some(i => i.key === req.key)
            return (
              <button
                key={req.key}
                type="button"
                disabled={exists}
                onClick={() => {
                  if (!exists) {
                    const newItems = [...items, { key: req.key, value: '' }]
                    updateItems(newItems)
                  }
                }}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-md border transition-colors',
                  exists
                    ? 'bg-surface-raised text-on-surface-muted border-border cursor-not-allowed'
                    : 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20'
                )}
              >
                {req.label}
              </button>
            )
          })}
        </div>
      </details>
    </div>
  )
}

export default SystemRequirementsInput