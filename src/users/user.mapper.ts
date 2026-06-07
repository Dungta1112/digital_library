export function toSafeUser(user: any) {
  if (!user) {
    return user;
  }
  const roles = user.roles?.map((userRole: any) => userRole.role?.code ?? userRole.code).filter(Boolean) ?? [];
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    status: user.status,
    roles
  };
}
