export interface UpdateUserDto {
  /** 头像 */
  headPic?: string;
  /** 昵称 */
  nickName?: string;
  /** 邮箱地址 */
  email: string;
  /** 验证码 */
  captcha: string;
}

export interface UserDetailVo {
  /** 用户ID */
  id: number;
  /** 用户名 */
  username: string;
  /** 昵称 */
  nickName: string;
  /** 邮箱 */
  email: string;
  /** 头像 */
  headPic: string;
  /** 手机号 */
  phoneNumber: string;
  /** 是否被冻结 */
  isFrozen: boolean;
  /** 创建时间 */
  createTime: number;
}
