
  export async function getAllOperacoes(){
    const data = await fetchAPI(
        `
        query PostBySlug($slug: String) {
          post: getPostList(filter: {term: {slug: $slug}}, size: 1, onlyEnabled: false) {
            items {
              slug
            }
          }
        }`,
        {
          variables: {
            slug,
          },
        }
      )
      return (data?.post?.items || [])[0]
  }