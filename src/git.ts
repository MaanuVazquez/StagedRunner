import git from 'simple-git/promise'

const Git = git(__dirname)

export const getStagedFilesDirectory = async (): Promise<string[]> => {
  const gitStatusResult = await Git.status()

  return gitStatusResult.files.map(fileStatus => {
    return fileStatus.path
  })
}
