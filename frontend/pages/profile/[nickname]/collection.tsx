// 보유 목록

import type { NextPage } from "next";
import { ProfileLayout, Layout } from "@components/ui/layout";
import useSWR from "swr";
import { Item } from "@components/ui/common";
import { useRouter } from "next/router";
import { OwnNftResponse } from ".";
import { useEffect, useState } from "react";
import { Nft } from "@components/ui/common/item";
import { useRecoilValue } from "recoil";
import { accessToken } from "@components/atoms/Auth";
import { tokenFetcher } from "@libs/client/useUser";

const ProfileCollection: NextPage = () => {
  const router = useRouter();

  const [collectionList, setCollectionList] = useState<Nft[]>();

  const TOKEN = useRecoilValue(accessToken);

  // 해당 nickname을 가진 유저의 판매/보유 nft 리스트 가져오기
  const { data } = useSWR<OwnNftResponse>(
    router.query.nickname
      ? [`${process.env.BASE_URL}/nft/user/${router.query.nickname}`, TOKEN]
      : null,
    tokenFetcher
  );

  // 가져온 리스트에서 보유중인 nft만 필터링
  useEffect(() => {
    if (data && data?.statusCode === 200) {
      const tmp = data.nftDtoList.filter((nft) => nft.seleStatus === false);
      setCollectionList(tmp);
    }
  }, [data, router]);

  return (
    <Layout seoTitle="프로필">
      <ProfileLayout>
        <div className="border-t">
          <div className="px-[52px] mt-8">
            {collectionList && collectionList?.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 py-4">
                  {collectionList?.map((nft) => (
                    <Item
                      key={nft.nftId}
                      enterprise={nft.enterprise}
                      imgUrl={nft.imgUrl}
                      likeCount={nft.likeCount}
                      nftId={nft.nftId}
                      nftName={nft.nftName}
                      price={nft.price}
                      myLike={nft.myLike}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="mx-9 my-6 h-[248px] text-center border flex flex-col justify-center items-center text-[28px] text-textGray">
                아직 보유하는 상품이 없습니다.
              </div>
            )}
          </div>
        </div>
      </ProfileLayout>
    </Layout>
  );
};

export default ProfileCollection;
