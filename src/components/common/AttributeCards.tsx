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
            <p style={{ fontSize: '10px', fontWeight: 400 }}>Add image</p>
          </div>
        </Dropzone>
      )}
      <Box p={'0.5rem 1rem'}>
        {onColorChange && (
          <div>
            <span style={{ color: '#707070', fontSize: 10 }}>
              Name <span style={{ color: '#FF0000' }}>*</span>{' '}
            </span>
            <TextInput
              sx={{
                border: '1px solid #B82C67',
                fontSize: 10,
                borderRadius: '2px',
                '.mantine-Input-input': {
                  minHeight: 0,
                  height: 24,
                  paddingLeft: 8,
                },
              }}
              h={24}
              pb={8}
              bg="white"
              maxLength={20}
              size="10px"
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
            paddingTop: onColorChange ? 10 : 32,
          }}
        >
          <Box>
            <span style={{ color: '#7C7C7C', fontSize: '10px' }}>
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
                sx={{
                  '.mantine-Input-input': {
                    height: 24,
                    minHeight: 0,
                    paddingLeft: 8,
                    borderColor: '#B82C67',
                  },
                }}
                w={'100px'}
                size="10px"
                radius={2}
                maxLength={20}
                mb={'0.85rem'}
                onChange={onAttributeChange}
                required
                defaultValue={attributeName}
              />
            )}
          </Box>
          <Box ml={'1rem'} mb={'0.85rem'}>
            <span style={{ color: '#7C7C7C', fontSize: '10px' }}>
              Price plus ($)
            </span>
            <NumberInput
              rightSection={'$'}
              h={'24px'}
              w={onColorChange ? '7rem' : '5rem'}
              radius={2}
              precision={2}
              sx={{
                '.mantine-Input-input': {
                  height: 24,
                  minHeight: 0,
                  paddingLeft: 8,
                  borderColor: '#B82C67',
                },
                '.mantine-Input-rightSection': {
                  marginRight: 6,
                },
              }}
              size="10px"
              decimalSeparator="."
              maxLength={9}
              onChange={onPriceChange}
              defaultValue={attributePrice}
              min={0}
            />
          </Box>
        </div>

        <Box sx={{ float: 'right' }} mt={'5px'}>
          <Button
            h={22}
            size="10px"
            w={56}
            color="white"
            bg={'#B82C67'}
            radius={10}
            onClick={onCancel}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default AttributeCards;
