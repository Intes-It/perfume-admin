import {
  UnstyledButton,
  BackgroundImage,
  Indicator,
  Box,
  Menu,
  createStyles,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { POST } from '../utils/fetch';
const useStyles = createStyles((theme) => ({
  item: {
    '&[data-hovered]': {
      backgroundColor:
        theme.colors[theme.primaryColor][theme.fn.primaryShade()],
      color: theme.white,
    },
  },
}));
const { Target, Dropdown, Item } = Menu;
const HeaderMenu = () => {
  const { classes } = useStyles();
  const logout = async () => {
    try {
      const res = await POST('/api/admin/logout');
      if (res.status === 200) {
        localStorage.removeItem('auth');
        window.location.reload();
      }
    } catch (error) {
      notifications.show({
        title: 'Warning',
        message: `${error}`,
        color: 'red',
      });
    }
  };
  return (
    <BackgroundImage src={'/banner.png'} h={'26vh'} p={'lg'}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Menu trigger="hover" classNames={classes}>
          <Target>
            <UnstyledButton>
              <div style={{ textAlign: 'center' }}>
                <img src={'/bars.svg'} alt={'icon'} />
              </div>
            </UnstyledButton>
          </Target>
          <Dropdown bg={'#B82C67'} px={'20px'}>
            <Item>
              <a
                href={'/category'}
                style={{
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 400,
                  cursor: 'pointer',
                }}
              >
                Category
              </a>
            </Item>
            <Item>
              <a
                href={'/'}
                style={{
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 400,
                  cursor: 'pointer',
                }}
              >
                Product management
              </a>
            </Item>
            <Item>
              <a
                href={'/list_order'}
                style={{
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 400,
                }}
              >
                List order
              </a>
            </Item>
            <Item>
              <a
                href={'/voucher_manager'}
                style={{
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 400,
                  cursor: 'pointer',
                }}
              >
                Voucher management
              </a>
            </Item>
            <Item>
              <a
                href={'/delivery_cost'}
                style={{
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 400,
                }}
              >
                Delivery cost
              </a>
            </Item>{' '}
          </Dropdown>
        </Menu>
        <div style={{ display: 'flex' }}>
          <Box mr={20} component={'div'}>
            <Menu>
              <Target>
                <Indicator inline position={'top-end'}>
                  <div className="w-12 h-12 rounded-full flex  focus:bg-[#FC699A] cursor-pointer">
                    <svg
                      width="22"
                      height="26"
                      viewBox="0 0 22 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-auto my-auto"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11 2.10161e-08C10.6496 -4.51539e-05 10.3033 0.0727393 9.98461 0.213421C9.66588 0.354102 9.38215 0.559393 9.15265 0.81538C8.92315 1.07137 8.75323 1.37207 8.65443 1.69711C8.55563 2.02214 8.53025 2.36392 8.58 2.69927C6.80854 3.205 5.2538 4.25126 4.14797 5.68179C3.04213 7.11232 2.44454 8.85037 2.44444 10.6364V20.0909H1.22222C0.898069 20.0909 0.587192 20.2154 0.357981 20.4371C0.128769 20.6587 0 20.9593 0 21.2727C0 21.5862 0.128769 21.8868 0.357981 22.1084C0.587192 22.33 0.898069 22.4545 1.22222 22.4545H20.7778C21.1019 22.4545 21.4128 22.33 21.642 22.1084C21.8712 21.8868 22 21.5862 22 21.2727C22 20.9593 21.8712 20.6587 21.642 20.4371C21.4128 20.2154 21.1019 20.0909 20.7778 20.0909H19.5556V10.6364C19.5555 8.85037 18.9579 7.11232 17.852 5.68179C16.7462 4.25126 15.1915 3.205 13.42 2.69927C13.4698 2.36392 13.4444 2.02214 13.3456 1.69711C13.2468 1.37207 13.0769 1.07137 12.8474 0.81538C12.6178 0.559393 12.3341 0.354102 12.0154 0.213421C11.6967 0.0727393 11.3504 -4.51539e-05 11 2.10161e-08ZM13.4444 24.8182C13.4444 25.1316 13.3157 25.4322 13.0865 25.6539C12.8573 25.8755 12.5464 26 12.2222 26H9.77778C9.45362 26 9.14275 25.8755 8.91354 25.6539C8.68433 25.4322 8.55556 25.1316 8.55556 24.8182C8.55556 24.5047 8.68433 24.2041 8.91354 23.9825C9.14275 23.7609 9.45362 23.6364 9.77778 23.6364H12.2222C12.5464 23.6364 12.8573 23.7609 13.0865 23.9825C13.3157 24.2041 13.4444 24.5047 13.4444 24.8182Z"
                        fill="#BA2664"
                      />
                    </svg>
                  </div>
                </Indicator>
              </Target>
              <Dropdown bg={'#fff'} ml={'-72px'}>
                <div className="w-[300px] h-fit max-h-[300px] flex flex-col">
                  <div
                    className="flex flex-row px-4 py-2 justify-between text-[#B82C67] text-[12px] "
                    style={{
                      borderBottom: '0.3 solid #B82C67',
                    }}
                  >
                    <div className="font-semibold">Notifications</div>{' '}
                    <div className="font-medium">Mark all as read</div>
                  </div>
                  <div className="flex flex-row "></div>
                </div>
              </Dropdown>
            </Menu>
          </Box>
          <Menu classNames={classes}>
            <Target>
              <UnstyledButton className="flex items-start">
                <div className="w-12 h-12 rounded-full flex  focus:bg-[#FC699A]">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-auto my-auto"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M15 2.5C8.09625 2.5 2.5 8.09625 2.5 15C2.5 21.9037 8.09625 27.5 15 27.5C21.9037 27.5 27.5 21.9037 27.5 15C27.5 8.09625 21.9037 2.5 15 2.5ZM10.625 11.875C10.625 11.3005 10.7382 10.7316 10.958 10.2008C11.1779 9.66996 11.5002 9.18766 11.9064 8.78141C12.3127 8.37515 12.795 8.05289 13.3258 7.83303C13.8566 7.61316 14.4255 7.5 15 7.5C15.5745 7.5 16.1434 7.61316 16.6742 7.83303C17.205 8.05289 17.6873 8.37515 18.0936 8.78141C18.4998 9.18766 18.8221 9.66996 19.042 10.2008C19.2618 10.7316 19.375 11.3005 19.375 11.875C19.375 13.0353 18.9141 14.1481 18.0936 14.9686C17.2731 15.7891 16.1603 16.25 15 16.25C13.8397 16.25 12.7269 15.7891 11.9064 14.9686C11.0859 14.1481 10.625 13.0353 10.625 11.875ZM22.8225 21.23C21.8868 22.407 20.6973 23.3574 19.3427 24.0103C17.9882 24.6631 16.5036 25.0014 15 25C13.4964 25.0014 12.0118 24.6631 10.6573 24.0103C9.30275 23.3574 8.1132 22.407 7.1775 21.23C9.20375 19.7762 11.9687 18.75 15 18.75C18.0312 18.75 20.7962 19.7762 22.8225 21.23Z"
                      fill="#B82C67"
                    />
                  </svg>
                </div>
              </UnstyledButton>
            </Target>
            <Dropdown bg={'#FFFFFF'} w={200}>
              <div className="flex flex-col mt-3 mb-5">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto mb-2"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4ZM17 19C17 18.0807 17.1811 17.1705 17.5328 16.3212C17.8846 15.4719 18.4002 14.7003 19.0503 14.0503C19.7003 13.4002 20.4719 12.8846 21.3212 12.5328C22.1705 12.1811 23.0807 12 24 12C24.9193 12 25.8295 12.1811 26.6788 12.5328C27.5281 12.8846 28.2997 13.4002 28.9497 14.0503C29.5998 14.7003 30.1154 15.4719 30.4672 16.3212C30.8189 17.1705 31 18.0807 31 19C31 20.8565 30.2625 22.637 28.9497 23.9497C27.637 25.2625 25.8565 26 24 26C22.1435 26 20.363 25.2625 19.0503 23.9497C17.7375 22.637 17 20.8565 17 19ZM36.516 33.968C35.0189 35.8512 33.1156 37.3719 30.9483 38.4164C28.7811 39.4609 26.4058 40.0022 24 40C21.5942 40.0022 19.2189 39.4609 17.0517 38.4164C14.8844 37.3719 12.9811 35.8512 11.484 33.968C14.726 31.642 19.15 30 24 30C28.85 30 33.274 31.642 36.516 33.968Z"
                    fill="#ADADAD"
                  />
                  <rect
                    x="32"
                    y="32"
                    width="16"
                    height="16"
                    rx="8"
                    fill="#EFEFEF"
                  />
                  <path
                    d="M39.9999 42.157C40.4901 42.157 40.9069 41.9853 41.2501 41.6421C41.5934 41.2988 41.7649 40.8822 41.7646 40.3923C41.7646 39.9021 41.593 39.4853 41.2497 39.1421C40.9065 38.7988 40.4899 38.6273 39.9999 38.6276C39.5097 38.6276 39.093 38.7992 38.7497 39.1425C38.4065 39.4857 38.235 39.9023 38.2352 40.3923C38.2352 40.8825 38.4069 41.2992 38.7501 41.6425C39.0934 41.9857 39.51 42.1572 39.9999 42.157ZM36.8627 43.5295C36.647 43.5295 36.4623 43.4527 36.3086 43.2989C36.1548 43.1452 36.0781 42.9606 36.0784 42.7452V38.0393C36.0784 37.8236 36.1552 37.6389 36.309 37.4852C36.4627 37.3315 36.6473 37.2548 36.8627 37.255H38.098L38.8235 36.4707H41.1764L41.9019 37.255H43.1372C43.3529 37.255 43.5376 37.3319 43.6913 37.4856C43.845 37.6393 43.9218 37.8239 43.9215 38.0393V42.7452C43.9215 42.9609 43.8446 43.1456 43.6909 43.2993C43.5372 43.4531 43.3526 43.5298 43.1372 43.5295H36.8627Z"
                    fill="#656565"
                  />
                </svg>

                <span className="mx-auto"> admin@email.com</span>
              </div>
              <Item p={0}>
                <div
                  onClick={() => logout()}
                  className="bg-white w-52 p-4 flex flex-row"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M2 0.333008C1.46957 0.333008 0.960859 0.543722 0.585786 0.918794C0.210714 1.29387 0 1.80257 0 2.33301V11.6663C0 12.1968 0.210714 12.7055 0.585786 13.0806C0.960859 13.4556 1.46957 13.6663 2 13.6663H6C6.53043 13.6663 7.03914 13.4556 7.41421 13.0806C7.78929 12.7055 8 12.1968 8 11.6663V2.33301C8 1.80257 7.78929 1.29387 7.41421 0.918794C7.03914 0.543722 6.53043 0.333008 6 0.333008H2ZM8.862 3.86167C8.98702 3.73669 9.15656 3.66648 9.33333 3.66648C9.51011 3.66648 9.67965 3.73669 9.80467 3.86167L12.4713 6.52834C12.5963 6.65336 12.6665 6.8229 12.6665 6.99967C12.6665 7.17645 12.5963 7.34599 12.4713 7.47101L9.80467 10.1377C9.67893 10.2591 9.51053 10.3263 9.33573 10.3248C9.16093 10.3233 8.99373 10.2532 8.87012 10.1296C8.74652 10.0059 8.6764 9.83874 8.67488 9.66394C8.67336 9.48914 8.74056 9.32074 8.862 9.19501L10.3907 7.66634H4.66667C4.48986 7.66634 4.32029 7.5961 4.19526 7.47108C4.07024 7.34605 4 7.17649 4 6.99967C4 6.82286 4.07024 6.65329 4.19526 6.52827C4.32029 6.40325 4.48986 6.33301 4.66667 6.33301H10.3907L8.862 4.80434C8.73702 4.67932 8.66681 4.50978 8.66681 4.33301C8.66681 4.15623 8.73702 3.98669 8.862 3.86167Z"
                      fill="#B82C67"
                    />
                  </svg>

                  <span className="text-[12px] ml-2 text-[#BF336E]">
                    Log out
                  </span>
                </div>
              </Item>
            </Dropdown>
          </Menu>
        </div>
      </div>
    </BackgroundImage>
  );
};

export default HeaderMenu;
