import { TestingModule , Test } from "@nestjs/testing"; 
import { BlogService } from "./blog.service";

describe("Blog Service" , () => {
    let blogService : BlogService
    beforeEach(async () => {
        const module : TestingModule = await Test.createTestingModule({
            providers : [
                BlogService
            ]
        }).compile()

        blogService = module.get<BlogService>(BlogService)
    })  
    describe("Get Posts" , () => {
        it("Should return empty posts" , async () => {
            const expectedResults : Record<string,any>= []
            jest.spyOn(blogService , "getPosts").mockResolvedValue(expectedResults)
            const posts = await blogService.getPosts()
            expect(posts).toEqual(expectedResults)
        })

        it("Should throw error when error occurs" , async () => {
           
            jest.spyOn(blogService , "getPosts").mockRejectedValue(new Error("Error Occured"))
            let errorResult : any ;
            try{
                await blogService.getPosts()
            }catch(e){
                errorResult = e
            }
            expect(errorResult).toBeInstanceOf(Error) 
            expect(errorResult.message).toEqual("Error Occured")
        })
    })
})