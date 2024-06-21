import {
  Box,
  Button,
  ColorInput,
  NumberInput,

  // ColorPicker,
  Paper,
  TextInput,
} from '@mantine/core';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import React from 'react';
import { stripBaseUrl } from '../../hooks/convertImage';
import ImagePreview from './ImagePreview';
type attributeCardProps = {
  onAddImage: (file: FileWithPath[]) => void;
  attributeType?: string;
  attributePrice?: number;
  onCancel?: () => void;
  productImage: string;
  attributeTitle: string;
  onPriceChange?: (e: number) => void;
  onColorChange?: (e: string) => void;
  onAttributeChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onReplaceImage: (file: File) => void;
  defaultColor?: string;
  attributeName?: string;
  onNameColorChange?: (value: string) => void;
};

const AttributeCards: React.FC<attributeCardProps> = ({
  attributeType,
  attributePrice,
  onAddImage,
  onCancel,
  productImage,
  attributeTitle,
  onPriceChange,
  onColorChange,
  onRemoveImage,
  onReplaceImage,
  onAttributeChange,
  defaultColor,
  attributeName,
  onNameColorChange,
}) => {
  // const [chooseColor, setChooseColor] = React.useState(false);
  // const [color, setColor] = React.useState('');

  return (
    <Paper
      w={'14.4375rem'}
      h={onColorChange ? '19rem' : '17.75rem'}
      bg={'#fff8f8'}
      radius={'sm'}
    >
      {productImage ? (
        <ImagePreview
          remove
          image={stripBaseUrl(productImage)}
          onRemove={onRemoveImage}
          onReplace={onReplaceImage}
          imageWidth={'14.4375rem'}
          imageHeight={'8.75rem'}
        />
      ) : (
        <Dropzone
          onDrop={onAddImage}
          bg={'#fff8f8'}
          h={'8.75rem'}
          maxSize={3 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
        >
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <img
              src={'/add_image_ic.svg'}
              className="pb-1.5 mx-auto"
              width={32}
              height={32}
              alt={'img'}
            />
            <p style={{ fontSize: '13px' }}>Add image</p>
          </div>
        </Dropzone>
      )}
      <Box p={'0.5rem 1rem'}>
        {onColorChange && (
          <div>
            <span style={{ color: '#707070', fontSize: 12 }}>
              Name <span style={{ color: '#FF0000' }}>*</span>{' '}
            </span>
            <TextInput
              sx={{
                border: '1px solid #B82C67',
                borderRadius: '5px',
                fontSize: 12,
                '.mantine-8tictr': {
                  minHeight: 0,
                  height: 24,
                  paddingLeft: 6,
                },
              }}
              h={24}
              pb={8}
              bg="white"
              maxLength={20}
              variant={'unstyled'}
              type={'text'}
              onChange={(e) =>
                onNameColorChange && onNameColorChange(e.target?.value)
              }
              defaultValue={attributeName}
              required
              min={1}
            />
          </div>
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 10,
          }}
        >
          <Box>
            <span style={{ color: '#7C7C7C', fontSize: '12px' }}>
              {attributeTitle}
              <span style={{ color: '#ff0000' }}> *</span>
            </span>

            {attributeTitle.toLowerCase() === 'color' ? (
              <div className="relative cursor-pointer">
                <div
                  style={{
                    width: 24,
                    height: 24,
                    backgroundColor: defaultColor || 'red',
                    borderRadius: 2,
                    cursor: 'pointer',
                  }}
                />
                <ColorInput
                  style={{
                    opacity: 0,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                  withEyeDropper={false}
                  variant="unstyled"
                  onChange={onColorChange}
                  defaultValue={defaultColor}
                />
              </div>
            ) : (
              <TextInput
                type="text"
                h={'1.5rem'}
                w={'6.8125rem'}
                maxLength={20}
                mb={'0.85rem'}
                onChange={onAttributeChange}
                required
                defaultValue={attributeName}
                value={attributeName}
              />
            )}
          </Box>
          <Box ml={'1rem'} mb={'0.85rem'}>
            <span style={{ color: '#7C7C7C', fontSize: '12px' }}>
              Price plus ($)
            </span>
            <NumberInput
              rightSection={'$'}
              h={'1.5rem'}
              w={'5rem'}
              precision={2}
              decimalSeparator="."
              maxLength={9}
              onChange={onPriceChange}
              defaultValue={attributePrice}
              min={0}
            />
          </Box>
        </div>
        {attributeType === 'edit' ? (
          <div style={{ float: 'right' }}>
            <Button variant={'subtle'} onClick={onCancel}>
              <span style={{ color: '#333' }}>Delete</span>
            </Button>
          </div>
        ) : (
          <Box sx={{ float: 'right' }} mt={'5px'}>
            <Button variant={'subtle'} onClick={onCancel}>
              <span style={{ color: '#333' }}>Delete</span>
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default AttributeCards;
